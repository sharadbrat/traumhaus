import Phaser from "phaser";
import FOVLayer from "../entities/FOVLayer";
import Player from "../entities/Player";
import Map from "../entities/Map";
import { AssetManager } from '../AssetManager';
import { SceneIdentifier } from './SceneManager';

const worldTileHeight = 81;
const worldTileWidth = 81;

export default class DungeonScene extends Phaser.Scene {
  lastX: number;
  lastY: number;
  player: Player | null;
  fov: FOVLayer | null;
  tilemap: Phaser.Tilemaps.Tilemap | null;
  cameraResizeNeeded: boolean;

  preload(): void {
    this.load.image(AssetManager.environment.name, AssetManager.environment.file);
    this.load.image(AssetManager.util.name, AssetManager.util.file);
    this.load.spritesheet(AssetManager.player.name, AssetManager.player.file, {
      frameHeight: AssetManager.player.height,
      frameWidth: AssetManager.player.width
    });
  }

  constructor() {
    super(SceneIdentifier.DUNGEON_SCENE);
    this.lastX = -1;
    this.lastY = -1;
    this.player = null;
    this.fov = null;
    this.tilemap = null;
    this.cameraResizeNeeded = false;
  }

  create(): void {
    const map = new Map(worldTileWidth, worldTileHeight, this);
    this.tilemap = map.tilemap;

    this.fov = new FOVLayer(map);

    Object.values(AssetManager.player.animations).forEach((anim: any) => {
      if (!this.anims.get(anim.name)) {
        this.anims.create({
          key: anim.name,
          frames: this.anims.generateFrameNumbers(AssetManager.player.name, anim),
          frameRate: anim.frameRate,
          repeat: anim.repeat ? -1 : 0
        });
      }
    });

    this.player = new Player(
      this.tilemap.tileToWorldX(map.startingX),
      this.tilemap.tileToWorldY(map.startingY),
      this
    );

    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(
      0,
      0,
      map.width * AssetManager.environment.width,
      map.height * AssetManager.environment.height
    );
    this.cameras.main.startFollow(this.player.sprite);

    this.physics.add.collider(this.player.sprite, map.wallLayer);
    window.addEventListener("resize", () => {
      this.cameraResizeNeeded = true;
    });

    this.input.keyboard.on("keydown_R", () => {
      this.scene.stop("InfoScene");
      this.scene.start("ReferenceScene");
    });

    this.scene.run("InfoScene");
  }

  update(time: number, delta: number) {
    this.player.update(time);
    const camera = this.cameras.main;

    if (this.cameraResizeNeeded) {
      // Do this here rather than the resize callback as it limits
      // how much we'll slow down the game
      camera.setSize(window.innerWidth, window.innerHeight);
      this.cameraResizeNeeded = false;
    }

    const player = new Phaser.Math.Vector2({
      x: this.tilemap!.worldToTileX(this.player!.sprite.body.x),
      y: this.tilemap!.worldToTileY(this.player!.sprite.body.y)
    });

    const bounds = new Phaser.Geom.Rectangle(
      this.tilemap!.worldToTileX(camera.worldView.x) - 1,
      this.tilemap!.worldToTileY(camera.worldView.y) - 1,
      this.tilemap!.worldToTileX(camera.worldView.width) + 2,
      this.tilemap!.worldToTileX(camera.worldView.height) + 2
    );

    this.fov!.update(player, bounds, delta);
  }
}
