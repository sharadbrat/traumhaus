import Phaser from 'phaser';
import { FOVLayer, Player } from '../entities';
import { AssetManager } from '../AssetManager';
import { SceneIdentifier } from './SceneManager';
import { LevelMap, LevelMapConstructorOptions, MapPosition } from '../entities/LevelMap';
import { LEVEL_1_DATA, LevelManager } from '../levels';
import { LightLayer } from '../entities/LightLayer';
import { GameDataService, GameMenuService } from '../../service';
import { GameSoundService } from '../../service/GameSoundService';

export class GameScene extends Phaser.Scene {
  private lastX: number;
  private lastY: number;
  private player: Player | null;
  cameraResizeNeeded: boolean;

  myfov: LightLayer;

  private levelMap: LevelMap;
  private doorFlag: boolean;
  private playerCollider: Phaser.Physics.Arcade.Collider;

  constructor() {
    super(SceneIdentifier.GAME_SCENE);
    this.lastX = -1;
    this.lastY = -1;
    this.cameraResizeNeeded = false;
    this.doorFlag = false;
  }

  create(): void {
    this.setupLevelMap();

    window.addEventListener('resize', () => {
      this.cameraResizeNeeded = true;
    });

    this.input.keyboard.on('keydown_R', () => {
      this.scene.stop(SceneIdentifier.INFO_SCENE);
      this.scene.start(SceneIdentifier.REFERENCE_SCENE);
    });

    this.input.keyboard.on('keydown_ESC', () => {
      GameMenuService.getInstance().triggerOnMenuToggle();
    });

    const mainTheme = this.game.sound.add(AssetManager.soundAssets.main.name);

    GameSoundService.getInstance().playSound(AssetManager.soundAssets.main.name);
  }

  update(time: number, delta: number) {


    const door = this.levelMap.checkPlayerDoorCollision(this.player.getBody());

    if (door) {
      GameDataService.getInstance().changeLevel(door.toId);
      GameDataService.getInstance().setLastDoor(door);
      this.scene.start(SceneIdentifier.GAME_SCENE);
      return;
    }

    this.player.update(time);
    const camera = this.cameras.main;

    if (this.cameraResizeNeeded) {
      // Do this here rather than the resize callback as it limits
      // how much we'll slow down the game
      camera.setSize(window.innerWidth, window.innerHeight);
      this.cameraResizeNeeded = false;
    }

    const player = new Phaser.Math.Vector2({
      x: this.levelMap.getTilemap().worldToTileX(this.player.sprite.body.x),
      y: this.levelMap.getTilemap().worldToTileY(this.player.sprite.body.y)
    });

    const bounds = this.getCameraBounds(camera);

    this.myfov.update(player, bounds, delta);
  }

  private getCurrentLevel() {
    let level = GameDataService.getInstance().getCurrentLevel();

    if (!level) {
      level = LEVEL_1_DATA;
      GameDataService.getInstance().setCurrentLevel(level);
    }

    return level;
  }

  private createPlayer(): Player {
    let pos;
    let lastDoor = GameDataService.getInstance().getLastDoor();
    if (lastDoor) {
      pos = lastDoor.toPosition;
    } else {
      pos = GameDataService.getInstance().getCurrentLevel().startPosition;
    }

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
      pos.x * this.levelMap.getTilemap().tileWidth,
      pos.y * this.levelMap.getTilemap().tileHeight,
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
      this.levelMap.getTilemap().worldToTileX(camera.worldView.x) - 1,
      this.levelMap.getTilemap().worldToTileY(camera.worldView.y) - 1,
      this.levelMap.getTilemap().worldToTileX(camera.worldView.width) + 2,
      this.levelMap.getTilemap().worldToTileY(camera.worldView.height) + 2
    );
  }

  private setupLevelMap() {
    let currentLevel = this.getCurrentLevel();

    this.levelMap = new LevelMap({data: currentLevel, scene: this});

    this.player = this.createPlayer();

    this.createCamera(this.levelMap);

    this.playerCollider = this.physics.add.collider(this.player.sprite, this.levelMap.getCollisionLayer());

    this.myfov = new LightLayer(this.levelMap);
  }
}
