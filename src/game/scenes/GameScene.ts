import Phaser from 'phaser';
import {
  LevelMap,
  LevelMapData,
  LevelObject,
  LevelObjectData,
  LightLayer,
  MapObjectFactory,
  Player
} from '../entities';
import { AssetManager } from '../assets';
import { SceneIdentifier } from './SceneManager';
import { LEVEL_1_DATA } from '../levels';
import { GameProgressService, GameMenuService, GameGhostService, GameSoundService } from '../../service';
import { TriggerManager } from '../TriggerManager';
import { DialogManager } from '../dialogs';

export class GameScene extends Phaser.Scene {
  private lastX: number;
  private lastY: number;
  private player: Player | null;
  cameraResizeNeeded: boolean;

  lightLayer: LightLayer;

  private levelMap: LevelMap;
  private playerCollider: Phaser.Physics.Arcade.Collider;

  private ghostService: GameGhostService;
  private menuService: GameMenuService;
  private soundService: GameSoundService;
  private progressService: GameProgressService;

  private realWorldObjects: LevelObject[];
  private ghostWorldObjects: LevelObject[];

  constructor() {
    super(SceneIdentifier.GAME_SCENE);
    this.lastX = -1;
    this.lastY = -1;
    this.cameraResizeNeeded = false;

    this.menuService = GameMenuService.getInstance();
    this.ghostService = GameGhostService.getInstance();
    this.soundService = GameSoundService.getInstance();
    this.progressService = GameProgressService.getInstance();
  }

  preload(): void {
    AssetManager.loadAssets(this);
  }

  create(): void {
    this.initializeSounds();
    AssetManager.loadAnimations(this);
    this.setupLevelMap();

    window.addEventListener('resize', () => {
      this.cameraResizeNeeded = true;
    });

    this.input.keyboard.on('keydown_R', () => {
      this.scene.stop(SceneIdentifier.INFO_SCENE);
      this.scene.start(SceneIdentifier.REFERENCE_SCENE);
    });

    this.input.keyboard.on('keydown_Q', () => {
      if (this.progressService.getProgress().canBecomeGhost) {
        const mode = !this.ghostService.isGhostMode();

        this.ghostService.setGhostMode(mode);
        this.lightLayer.setGhostMode(mode);
        this.levelMap.setGhostMode(mode);
        this.player.setGhostMode(mode);
        this.setObjectsGhostMode(mode);

        this.playerCollider.destroy();
        this.playerCollider = this.physics.add.collider(this.player.getSprite(), this.levelMap.getCollisionLayer());

        this.setupMusicTheme(this.getCurrentLevel());
      }
    });

    this.input.keyboard.on('keydown_ESC', () => {
      GameMenuService.getInstance().triggerOnMenuToggle();
    });

    // const mainTheme = this.game.sound.add(AssetManager.soundAssets.main.name);

    // GameSoundService.getInstance().playSfx(AssetManager.soundAssets.main.name);
  }

  update(time: number, delta: number) {
    const door = this.levelMap.checkPlayerDoorCollision(this.player.getBody());

    if (door) {
      GameProgressService.getInstance().changeLevel(door.toId);
      GameProgressService.getInstance().setLastDoor(door);
      this.scene.start(SceneIdentifier.GAME_SCENE);
      return;
    } else {
      this.updatePlayer(time);

      this.updateCamera();

      this.updateGameObjects(time);

      this.updateMyFOV(delta);
    }
  }

  getPlayer(): Player {
    return this.player;
  }

  getLevelMap(): LevelMap {
    return this.levelMap;
  }

  private createCollider() {
    this.playerCollider = this.physics.add.collider(this.player.getSprite(), this.levelMap.getCollisionLayer());
  }

  private getCurrentLevel(): LevelMapData {
    let level = this.progressService.getCurrentLevel();

    if (!level) {
      level = LEVEL_1_DATA;
      this.progressService.setCurrentLevel(level);
    }

    return level;
  }

  private createPlayer(): Player {
    let pos;
    let lastDoor = this.progressService.getLastDoor();

    if (lastDoor) {
      pos = lastDoor.toPosition;
    } else {
      pos = this.progressService.getCurrentLevel().startPosition;
    }

    return new Player(
      pos.x * this.levelMap.getTilemap().tileWidth,
      pos.y * this.levelMap.getTilemap().tileHeight,
      this
    );
  }

  private createCamera(levelMap: LevelMap) {
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setZoom(4);
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

  private setupLevelMap() {
    TriggerManager.clear();

    let currentLevel = this.getCurrentLevel();

    this.levelMap = new LevelMap({data: currentLevel, scene: this});
    this.createLevelObjects(currentLevel);

    this.player = this.createPlayer();

    this.createCamera(this.levelMap);

    this.createCollider();

    this.lightLayer = new LightLayer(this.levelMap);

    this.setupDialogs(currentLevel);

    this.setupTriggers(currentLevel);

    this.setupMusicTheme(currentLevel);
  }

  private createLevelObjects(currentLevel: LevelMapData) {
    if (currentLevel.ghostWorld.objects) {
      this.ghostWorldObjects = currentLevel.ghostWorld.objects.map(el => {
        const object = this.createLevelObject(el);
        object.setVisible(this.ghostService.isGhostMode());
        return object;
      });
    } else {
      this.ghostWorldObjects = [];
    }

    if (currentLevel.realWorld.objects) {
      this.realWorldObjects = currentLevel.realWorld.objects.map(el => {
        const object = this.createLevelObject(el);
        object.setVisible(!this.ghostService.isGhostMode());
        return object;
      });
    } else {
      this.realWorldObjects = [];
    }
  }

  private createLevelObject(obj: LevelObjectData): LevelObject {
    return MapObjectFactory.create(this, obj);
  }

  private setObjectsGhostMode(isGhostMode: boolean) {
    if (this.realWorldObjects) {
      this.realWorldObjects.forEach(el => el.setVisible(!isGhostMode));
    }

    if (this.ghostWorldObjects) {
      this.ghostWorldObjects.forEach(el => el.setVisible(isGhostMode));
    }
  }

  private updateGameObjects(time: number) {
    if (this.ghostService.isGhostMode()) {
      if (this.ghostWorldObjects) {
        this.ghostWorldObjects.forEach(el => el.update(time));
      }
    } else {
      if (this.realWorldObjects) {
        this.realWorldObjects.forEach(el => el.update(time));
      }
    }
  }

  private updateMyFOV(delta: number) {
    const pos = new Phaser.Math.Vector2({
      x: this.levelMap.getTilemap().worldToTileX(this.player.getBody().x),
      y: this.levelMap.getTilemap().worldToTileY(this.player.getBody().y)
    });

    const bounds = this.getCameraBounds(this.cameras.main);

    this.lightLayer.update(pos, bounds, delta);
  }

  private updateCamera() {
    if (this.cameraResizeNeeded) {
      // Do this here rather than the resize callback as it limits
      // how much we'll slow down the game
      this.cameras.main.setSize(window.innerWidth, window.innerHeight);
      this.cameraResizeNeeded = false;
      this.game.canvas.width = window.innerWidth;
      this.game.canvas.height = window.innerHeight;
      this.game.scale.scaleMode = Phaser.Scale.RESIZE;
      this.game.scale.refresh();
    }
  }

  private updatePlayer(time: number) {
    this.player.update(time);
  }

  private setupTriggers(currentLevel: LevelMapData) {
    if (currentLevel.triggerActions) {
      currentLevel.triggerActions.forEach(trigger => TriggerManager.add(trigger.action, trigger.callback))
    }
  }

  private setupDialogs(currentLevel: LevelMapData) {
    DialogManager.clear();
    if (currentLevel.dialogs) {
      DialogManager.registerDialogs(currentLevel.dialogs);
    }
  }

  private setupMusicTheme(currentLevel: LevelMapData) {
    if (this.ghostService.isGhostMode()) {
      this.soundService.setTheme(currentLevel.ghostWorld.themeId, this);
    } else {
      this.soundService.setTheme(currentLevel.realWorld.themeId, this);
    }
  }

  private initializeSounds() {
    const soundService = GameSoundService.getInstance();
    soundService.initialize(this.game);
    soundService.addSoundsToGame(this.game);
  }
}
