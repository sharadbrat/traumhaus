import Phaser from 'phaser';
import { Player } from '../entities';
import { AssetManager } from '../AssetManager';
import { SceneIdentifier } from './SceneManager';
import { LevelMap } from '../entities/LevelMap';
import { LEVEL_1_DATA } from '../levels';
import { LightLayer } from '../entities/LightLayer';
import { GameDataService, GameMenuService } from '../../service';
import { GameSoundService } from '../../service/GameSoundService';
import { GameGhostService } from '../../service/GameGhostService';

export class GameScene extends Phaser.Scene {
  private lastX: number;
  private lastY: number;
  private player: Player | null;
  cameraResizeNeeded: boolean;

  myfov: LightLayer;

  private levelMap: LevelMap;
  private playerCollider: Phaser.Physics.Arcade.Collider;

  private ghostService: GameGhostService;
  private menuService: GameMenuService;
  private soundService: GameSoundService;
  private dataService: GameDataService;

  constructor() {
    super(SceneIdentifier.GAME_SCENE);
    this.lastX = -1;
    this.lastY = -1;
    this.cameraResizeNeeded = false;

    this.menuService = GameMenuService.getInstance();
    this.ghostService = GameGhostService.getInstance();
    this.soundService = GameSoundService.getInstance();
    this.dataService = GameDataService.getInstance();
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

    this.input.keyboard.on('keydown_Q', () => {
      const mode = !this.ghostService.isGhostMode();

      this.ghostService.setGhostMode(mode);
      this.myfov.setGhostMode(mode);
      this.levelMap.setGhostMode(mode);
      this.player.setGhostMode(mode);

      this.playerCollider.destroy();
      this.playerCollider = this.physics.add.collider(this.player.getSprite(), this.levelMap.getCollisionLayer())

    });

    this.input.keyboard.on('keydown_ESC', () => {
      GameMenuService.getInstance().triggerOnMenuToggle();
    });

    // const mainTheme = this.game.sound.add(AssetManager.soundAssets.main.name);

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
      x: this.levelMap.getTilemap().worldToTileX(this.player.getBody().x),
      y: this.levelMap.getTilemap().worldToTileY(this.player.getBody().y)
    });

    const bounds = this.getCameraBounds(camera);

    this.myfov.update(player, bounds, delta);
  }

  private createCollider() {
    // nihuya
  }

  private getCurrentLevel() {
    let level = this.dataService.getCurrentLevel();

    if (!level) {
      level = LEVEL_1_DATA;
      this.dataService.setCurrentLevel(level);
    }

    return level;
  }

  private createPlayer(): Player {
    let pos;
    let lastDoor = this.dataService.getLastDoor();

    if (lastDoor) {
      pos = lastDoor.toPosition;
    } else {
      pos = this.dataService.getCurrentLevel().startPosition;
    }

    this.setupPlayerAnimations(AssetManager.spriteAssets.player.name, AssetManager.spriteAssets.player.animations);

    this.setupPlayerAnimations(AssetManager.spriteAssets.ghostPlayer.name, AssetManager.spriteAssets.ghostPlayer.animations);

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
    this.cameras.main.startFollow(this.player.getSprite());
  }

  private getCameraBounds(camera: Phaser.Cameras.Scene2D.Camera): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(
      this.levelMap.getTilemap().worldToTileX(camera.worldView.x) - 1,
      this.levelMap.getTilemap().worldToTileY(camera.worldView.y) - 1,
      this.levelMap.getTilemap().worldToTileX(camera.worldView.width) + 2,
      this.levelMap.getTilemap().worldToTileY(camera.worldView.height) + 2
    );
  }

  private setupPlayerAnimations(spriteName: string, spriteAnimations: any) {
    Object.values(spriteAnimations).forEach((anim: any) => {
      if (!this.anims.get(spriteName + anim.name)) {
        this.anims.create({
          key: spriteName + anim.name,
          frames: this.anims.generateFrameNumbers(spriteName, anim),
          frameRate: anim.frameRate,
          repeat: anim.repeat ? -1 : 0
        });
      }
    });
  }

  private setupLevelMap() {
    let currentLevel = this.getCurrentLevel();

    this.levelMap = new LevelMap({data: currentLevel, scene: this});

    this.player = this.createPlayer();

    this.levelMap.createForegroundLayers();

    this.createCamera(this.levelMap);

    this.playerCollider = this.physics.add.collider(this.player.getSprite(), this.levelMap.getCollisionLayer());

    this.myfov = new LightLayer(this.levelMap);
  }
}
