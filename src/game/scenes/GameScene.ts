import Phaser from 'phaser';
import { FOVLayer, Player } from '../entities';
import { AssetManager } from '../AssetManager';
import { SceneIdentifier } from './SceneManager';
import { LevelMap, MapPosition } from '../entities/LevelMap';
import { LEVEL_1_DATA, LevelManager } from '../levels';
import { LightLayer } from '../entities/LightLayer';

export class GameScene extends Phaser.Scene {
  lastX: number;
  lastY: number;
  player: Player | null;
  fov: FOVLayer | null;
  tilemap: Phaser.Tilemaps.Tilemap | null;
  cameraResizeNeeded: boolean;

  myfov: LightLayer;

  private levelMap: LevelMap;

  constructor() {
    super(SceneIdentifier.GAME_SCENE);
    this.lastX = -1;
    this.lastY = -1;
    this.player = null;
    this.fov = null;
    this.tilemap = null;
    this.cameraResizeNeeded = false;
  }

  create(): void {

    const temp = new LevelMap(LEVEL_1_DATA, this);
    this.levelMap = temp;
    this.tilemap = temp.getTilemap();

    this.player = this.createPlayer(LEVEL_1_DATA.startPosition);

    this.createCamera(temp);

    this.physics.add.collider(this.player.sprite, temp.getCollisionLayer());

    window.addEventListener("resize", () => {
      this.cameraResizeNeeded = true;
    });

    this.input.keyboard.on("keydown_R", () => {
      this.scene.stop(SceneIdentifier.INFO_SCENE);
      this.scene.start(SceneIdentifier.REFERENCE_SCENE);
    });

    this.scene.run(SceneIdentifier.INFO_SCENE);

    this.myfov = new LightLayer(temp);
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
      x: this.tilemap.worldToTileX(this.player.sprite.body.x),
      y: this.tilemap.worldToTileY(this.player.sprite.body.y)
    });

    const bounds = this.getCameraBounds(camera);

    this.myfov.update(player, bounds, delta);

    const door = this.levelMap.checkPlayerDoorCollision(this.player.getBody());

    if (door) {
      this.tilemap.destroy();
      this.levelMap = new LevelMap(LevelManager.getLevelById(door.toId), this);
      this.tilemap = this.levelMap.getTilemap();
    }

    // this.fov!.update(player, bounds, delta);
  }

  private createPlayer(pos: MapPosition): Player {
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

    return new Player(
      pos.x * this.tilemap.tileWidth,
      pos.y * this.tilemap.tileHeight,
      this
    );
  }

  private createCamera(levelMap: LevelMap) {
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(
      0,
      0,
      levelMap.getWidth() * AssetManager.environment.width,
      levelMap.getHeight() * AssetManager.environment.height
    );
    this.cameras.main.startFollow(this.player.sprite);
  }

  private getCameraBounds(camera: Phaser.Cameras.Scene2D.Camera): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(
      this.tilemap!.worldToTileX(camera.worldView.x) - 1,
      this.tilemap!.worldToTileY(camera.worldView.y) - 1,
      this.tilemap!.worldToTileX(camera.worldView.width) + 2,
      this.tilemap!.worldToTileY(camera.worldView.height) + 2
    );
  }
}
