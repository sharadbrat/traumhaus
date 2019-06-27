import Phaser from 'phaser';

import { LevelMap, LevelObject, LightLayer, MapObjectFactory, Player, Projectile } from '../entities';
import { AssetManager } from '../assets';
import { SceneIdentifier, SceneManager } from './SceneManager';
import { LEVEL_1_TRIGGER_ACTIONS, LevelManager } from '../levels';
import { GameGhostService, GameMenuService, GameProgressService, GameSoundService } from '../../service';
import { TriggerContents, TriggerManager } from '../TriggerManager';
import { DialogManager } from '../dialogs';
import { Door, LevelMapData, LevelObjectData } from '../entities/model';
import { GameManager } from '../GameManager';
import { ControlsType, GameControlsService } from '../../service/GameControlsService';

// 10 seconds
const GHOST_COOLDOWN = 10 * 1000;
const SHOOT_COOLDOWN = 5 * 1000;

export class GameScene extends Phaser.Scene {
  private lastX: number;
  private lastY: number;
  private player: Player | null;
  cameraResizeNeeded: boolean;

  lightLayer: LightLayer;

  private levelMap: LevelMap;
  private playerRealCollider: Phaser.Physics.Arcade.Collider;
  private playerGhostCollider: Phaser.Physics.Arcade.Collider;

  private ghostService: GameGhostService;
  private menuService: GameMenuService;
  private soundService: GameSoundService;
  private progressService: GameProgressService;
  private controlsService: GameControlsService;

  private realWorldObjects: LevelObject[];
  private ghostWorldObjects: LevelObject[];

  private projectiles: Projectile[] = [];

  private nextCameraUpdate: number = 0;
  private gamepadShootFlag: boolean;
  private nextGhostAvailable: number = 0;
  private nextShootAvailable: number = 0;

  constructor() {
    super(SceneIdentifier.GAME_SCENE);
    this.lastX = -1;
    this.lastY = -1;
    this.cameraResizeNeeded = false;

    this.menuService = GameMenuService.getInstance();
    this.ghostService = GameGhostService.getInstance();
    this.soundService = GameSoundService.getInstance();
    this.progressService = GameProgressService.getInstance();
    this.controlsService = GameControlsService.getInstance();

    this.setupResizeEvents();
  }

  create(): void {
    this.initializeSounds();
    AssetManager.loadAnimations(this);
    this.setupLevelMap();

    if (GameControlsService.getInstance().getMode() === ControlsType.ON_SCREEN) {
      document.getElementById('button-switch').removeEventListener('pointerdown', this.onGhostButton);
      document.getElementById('button-switch').addEventListener('pointerdown', this.onGhostButton);
    } else if (GameControlsService.getInstance().getMode() === ControlsType.GAMEPAD) {
        // could not find the correct listener, so handle it in update
    } else {
      this.player.getKeys().ghost.removeListener('down', this.onGhostButton);
      this.player.getKeys().ghost.on('down', this.onGhostButton);
    }

    if (GameControlsService.getInstance().getMode() === ControlsType.ON_SCREEN) {
      document.getElementById('button-shoot').removeEventListener('pointerdown', this.onShootButton);
      document.getElementById('button-shoot').addEventListener('pointerdown', this.onShootButton);
    } else if (GameControlsService.getInstance().getMode() === ControlsType.GAMEPAD) {
        // could not find the correct listener, so handle it in update
    } else {
      this.player.getKeys().shoot.removeListener('down', this.onShootButton);
      this.player.getKeys().shoot.on('down', this.onShootButton);
    }

    this.input.keyboard.on('keydown_ESC', () => {
      GameMenuService.getInstance().triggerOnMenuToggle();
    });
  }

  update(time: number, delta: number) {
    const door = this.levelMap.checkPlayerDoorCollision(this.player.getBody());

    // if (time > this.nextCameraUpdate) {
    //   this.cameraResizeNeeded = true;
    //   this.nextCameraUpdate = time + 1000;
    // }

    if (door) {
      this.changeLevel(door);
      return;
    } else {

      // workaround for gamepad
      if (this.controlsService.getMode() === ControlsType.GAMEPAD) {
        const pad = this.controlsService.getGamepad();
        if (pad && pad.buttons[0].pressed) {
          this.onGhostButton();
        }
      }

      this.updatePlayer(time);

      this.updateCamera();

      this.updateGameObjects(time);

      this.updateProjectiles(time);

      this.updateLightLayer(delta);
    }
  }

  getPlayer(): Player {
    return this.player;
  }

  getLevelMap(): LevelMap {
    return this.levelMap;
  }

  getCamera(): Phaser.Cameras.Scene2D.Camera {
    return this.cameras.main;
  }

  setGhostMode(mode: boolean) {
    this.ghostService.setGhostMode(mode);
    this.lightLayer.setGhostMode(mode);
    this.levelMap.setGhostMode(mode);
    this.player.setGhostMode(mode);
    this.setObjectsGhostMode(mode);

    this.getCamera().flash(1000, 255, 255, 255, true);

    this.playerRealCollider.active = !this.ghostService.isGhostMode();
    this.playerGhostCollider.active = this.ghostService.isGhostMode();

    this.setupMusicTheme(this.getCurrentLevel());
  }

  private onGhostButton = () => {
    if (this.nextGhostAvailable < this.time.now && this.progressService.getProgress().controls.switch && this.progressService.getProgress().isControllable) {
      const mode = !this.ghostService.isGhostMode();
      this.nextGhostAvailable = this.time.now + GHOST_COOLDOWN;

      this.setGhostMode(mode);
    }
  };

  private createPlayerCollider() {
    if (this.levelMap.getMapData().realWorld) {
      this.playerRealCollider = this.physics.add.collider(this.player.getSprite(), this.levelMap.getRealCollisionLayer());
      this.playerRealCollider.active = !this.ghostService.isGhostMode();
    }

    if (this.levelMap.getMapData().realWorld) {
      this.playerGhostCollider = this.physics.add.collider(this.player.getSprite(), this.levelMap.getGhostCollisionLayer());
      this.playerGhostCollider.active = this.ghostService.isGhostMode();
    }
  }

  private getCurrentLevel(): LevelMapData {
    let level = this.progressService.getCurrentLevel();

    const isNewGame = this.progressService.getProgress().isNewGame;

    if (isNewGame || !level) {
      level = LevelManager.getFirstLevel();
      this.progressService.changeLevel(level.id);
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

    const wanted = 9 * AssetManager.TILE_SIZE;
    const zoomX = wanted / window.innerWidth;
    const zoomY = wanted / window.innerHeight;

    this.cameras.main.zoom = Math.min(1 / zoomX, 1 / zoomY);

    this.cameras.main.setBounds(
      0,
      0,
      levelMap.getWidth() * AssetManager.graphicalAssets.stage1real.width,
      levelMap.getHeight() * AssetManager.graphicalAssets.stage1real.height
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

    this.createPlayerCollider();

    this.lightLayer = new LightLayer(this.levelMap);

    this.setupDialogs(currentLevel);

    this.setupTriggers(currentLevel);

    this.setupMusicTheme(currentLevel);

    if (this.progressService.getProgress().isNewGame) {
      this.setupNewGame();
    }

    if (this.controlsService.getMode() === ControlsType.ON_SCREEN) {

    }
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
    if (this.ghostWorldObjects) {
      this.ghostWorldObjects.forEach(el => el.update(time));
    }

    if (this.realWorldObjects) {
      this.realWorldObjects.forEach(el => el.update(time));
    }
  }

  private updateLightLayer(delta: number) {
    const pos = new Phaser.Math.Vector2({
      x: this.levelMap.getTilemap().worldToTileX(this.player.getBody().center.x),
      y: this.levelMap.getTilemap().worldToTileY(this.player.getBody().center.y)
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

      const wanted = 9 * AssetManager.TILE_SIZE;
      const zoomX = wanted / window.innerWidth;
      const zoomY = wanted / window.innerHeight;

      this.getCamera().zoom = Math.min(1 / zoomX, 1 / zoomY);
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
    const world = this.ghostService.isGhostMode() ? currentLevel.ghostWorld : currentLevel.realWorld;
    this.soundService.setTheme(world.themeId, this);
    this.soundService.setAmbients(world.ambients, this);
  }

  private initializeSounds() {
    const soundService = GameSoundService.getInstance();
    soundService.initialize(this.game);
    soundService.addSoundsToGame(this.game);
  }

  private setupNewGame() {
    const time = 5000;
    this.getCamera().fadeFrom(time, 0, 0, 0, true);
    setTimeout(() => {
      TriggerManager.fire(LEVEL_1_TRIGGER_ACTIONS.ON_NEW_GAME, this.constructTriggerContents());
    }, time);
    this.progressService.getProgress().isNewGame = false;
  }

  private constructTriggerContents(): TriggerContents {
    return {
      scene: this,
      player: this.getPlayer(),
      services: {
        progress: this.progressService,
        ghost: this.ghostService,
        sound: this.soundService,
        menu: this.menuService,
        controls: this.controlsService,
      },
      managers: {
        dialog: DialogManager,
        trigger: TriggerManager,
        game: GameManager,
        asset: AssetManager,
        scene: SceneManager,
        level: LevelManager,
      },
    };
  }

  private setupResizeEvents() {
    window.addEventListener('resize', () => {
      this.cameraResizeNeeded = true;
    });

    window.addEventListener('orientationchange', () => {
      this.cameraResizeNeeded = true;
    });

    window.addEventListener('fullscreenchange', () => {
      this.cameraResizeNeeded = true;
    });

    /* Firefox */
    window.addEventListener("mozfullscreenchange", () => {
      this.cameraResizeNeeded = true;
    });

    /* Chrome, Safari and Opera */
    window.addEventListener("webkitfullscreenchange", () => {
      this.cameraResizeNeeded = true;
    });

    /* IE / Edge */
    window.addEventListener("msfullscreenchange", () => {
      this.cameraResizeNeeded = true;
    });
  }

  getCurrentObjects(): LevelObject[] {
    if (this.ghostService.isGhostMode()) {
      return this.ghostWorldObjects;
    } else {
      return this.realWorldObjects;
    }
  }

  changeLevel(door: Door) {
    GameSoundService.getInstance().setFootstepPlay(false);
    GameProgressService.getInstance().changeLevel(door.toId);
    GameProgressService.getInstance().setLastDoor(door);
    GameProgressService.getInstance().saveProgressToLocalStorage();
    this.scene.start(SceneIdentifier.GAME_SCENE);
  }

  private updateProjectiles(time: number) {

    // gamepad workaround
    const mode = this.controlsService.getMode();
    if (mode === ControlsType.GAMEPAD) {
      const pad = this.controlsService.getGamepad();
      if (pad && pad.buttons[1].pressed) {
        this.onShootButton();
        this.nextShootAvailable = time + SHOOT_COOLDOWN;
      }
    }

    this.projectiles.forEach(el => el.update());
  }

  private onShootButton = () => {
    if (!GameGhostService.getInstance().isGhostMode()) {
      return;
    }

    if (this.nextShootAvailable < this.time.now && this.progressService.getProgress().isControllable && this.progressService.getProgress().controls.shoot) {
      const pDir = this.player.getMovementDirection();

      if (pDir.x === 0 && pDir.y === 0) {
        return;
      }

      this.nextShootAvailable = this.time.now + SHOOT_COOLDOWN;
      const id = `${Date.now()}__${Math.random()}`;

      const {x, y} = this.player.getPosition();

      let norm = Math.abs(pDir.x) + Math.abs(pDir.y);
      if (norm === 0) {
        norm = 1;
      }
      const dir = {x: pDir.x / norm, y: pDir.y / norm};

      this.projectiles.push(new Projectile(id, x, y, dir, this));
    }
  };

  removeProjectile(id: string) {
    this.projectiles = this.projectiles.filter(el => el.id !== id);
  }
}
