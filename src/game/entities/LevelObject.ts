import { GameScene } from '../scenes/GameScene';
import { TriggerContents, TriggerManager } from '../TriggerManager';
import { GameGhostService, GameMenuService, GameProgressService, GameSoundService } from '../../service';
import { DialogManager } from '../dialogs';
import { GameManager } from '../GameManager';
import { AssetManager } from '../assets';
import { SceneManager } from '../scenes/SceneManager';
import { LevelManager } from '../levels';
import { LevelObjectData, MapPosition, Trigger, TriggerEvent } from './model';
import { LevelMap } from './LevelMap';
import { ControlsType, GameControlsService } from '../../service/GameControlsService';

export type CheckedTrigger = Trigger & { lastCheckedOn: number };

export class LevelObject {

  protected sprite: Phaser.Physics.Arcade.Sprite;
  protected scene: GameScene;
  protected isVisible: boolean;
  protected options: LevelObjectData;

  protected position: MapPosition;
  protected tilemap: Phaser.Tilemaps.Tilemap;
  protected triggers: CheckedTrigger[];
  protected isCollided: boolean;
  protected isDead: boolean;

  constructor(scene: GameScene, options: LevelObjectData) {
    this.scene = scene;
    this.options = options;
    this.sprite = this.setupSprite(options);
    this.tilemap = this.scene.getLevelMap().getTilemap();

    this.position = options.position;
    if (options.triggers) {
      this.triggers = options.triggers.map(el => ({...el, lastCheckedOn: 0}));
    }

    this.isCollided = false;
  }

  update(time: number) {
    if (this.isInDifferentWorld()) {
      return;
    }

    if (this.options.isCollideable) {
      this.isCollided = this.scene.physics.collide(this.scene.getPlayer().getSprite(), this.sprite);
    }

    if (this.options.triggers) {
      this.checkTriggers(time);
    }
  }

  public isInDifferentWorld() {
    if (this.options.inGhostWorld && !GameGhostService.getInstance().isGhostMode()) {
      return true;
    }

    if (!this.options.inGhostWorld && GameGhostService.getInstance().isGhostMode()) {
      return true;
    }
  }

  public setDead(val: boolean) {
    this.isDead = val;
    this.sprite.setVisible(!val);
    val ? this.sprite.disableBody() : this.sprite.enableBody(false, this.sprite.x, this.sprite.y, true, true);
  }

  public setVisible(val: boolean) {
    if (!this.isDead) {
      this.isVisible = val;
      this.sprite.setVisible(this.isVisible);
    }
  }

  public getPosition(): MapPosition {
    return this.sprite.body.position;
  }

  public getOptions(): LevelObjectData {
    return this.options;
  }

  protected setupSprite(options: LevelObjectData) {
    const {asset, offsetX, offsetY} = options.graphics;
    const {x, y} = this.getWorldPositionFromTilePosition(this.scene, options.position);

    const physicalOffsetX = options.position.offsetX || 0;
    const physicalOffsetY = options.position.offsetY || 0;

    const sprite = this.scene.physics.add.sprite(x + options.width / 2 + physicalOffsetX, y + physicalOffsetY, asset.name, 0);
    sprite.setSize(options.width, options.height);
    sprite.setOffset(offsetX, offsetY);
    const key = `${asset.name}__${asset.animations.idle.name}`;
    sprite.anims.play(key);
    sprite.setDepth(LevelMap.OBJECT_LAYER_DEPTH);
    // I had to comment this because it leaded to bugs when mobile version is played 0_0
    // sprite.setCollideWorldBounds(true);

    return sprite;
  }

  protected getWorldPositionFromTilePosition(scene: GameScene, position: MapPosition): MapPosition {
    return {
      x: scene.getLevelMap().getTilemap().tileToWorldX(position.x),
      y: scene.getLevelMap().getTilemap().tileToWorldY(position.y)
    };
  }

  protected checkTriggers(time: number) {
    if (this.triggers) {
      this.triggers.forEach(el => this.checkTrigger(el, time));
    }
  }

  protected checkTrigger(trigger: CheckedTrigger, time: number) {
    if (time > trigger.fixTime + trigger.lastCheckedOn) {

      if (trigger.event === TriggerEvent.ON_COLLIDE) {
        this.checkCollideTrigger(trigger, time);
      } else if (trigger.event === TriggerEvent.ON_ACTION) {
        this.checkActionTrigger(trigger, time);
      } else if (trigger.event === TriggerEvent.ON_IN_AREA) {
        this.checkInAreaTrigger(trigger, time);
      } else if (trigger.event === TriggerEvent.ON_IN_NEAR_AREA) {
        this.checkInNearAreaTrigger(trigger, time);
      }
    }
  }

  protected checkCollideTrigger(trigger: CheckedTrigger, time: number) {
    const player = this.scene.getPlayer();

    if (this.isCollided) {
      TriggerManager.fire(trigger.action, this.getTriggerContentObject());
      trigger.lastCheckedOn = time;
    }
  }

  protected checkActionTrigger(trigger: CheckedTrigger, time: number) {
    const distance = this.getDistance(this.sprite.body.center, this.scene.getPlayer().getBody().center);

    let interaction = false;

    if (GameControlsService.getInstance().getMode() === ControlsType.ON_SCREEN) {
      interaction = this.scene.getPlayer().getJoystickKeys().interact;
    } else if (GameControlsService.getInstance().getMode() === ControlsType.GAMEPAD) {
      const pad = GameControlsService.getInstance().getGamepad();
      if (pad) {
        interaction = pad.buttons[3].pressed;
      }
    } else {
      interaction = this.scene.getPlayer().getKeys().interact.isDown;
    }

    if (GameProgressService.getInstance().getProgress().isControllable && interaction && distance < 20) {
      TriggerManager.fire(trigger.action, this.getTriggerContentObject());
      trigger.lastCheckedOn = time;
    }
  }

  protected checkInAreaTrigger(trigger: CheckedTrigger, time: number) {
    const isOverlapping = this.scene.physics.overlap(this.sprite, this.scene.getPlayer().getSprite());
    // const distance = this.getDistance(this.sprite.body.center, this.scene.getPlayer().getBody().center);

    if (isOverlapping) {
      TriggerManager.fire(trigger.action, this.getTriggerContentObject());
      trigger.lastCheckedOn = time;
    }
  }

  protected checkInNearAreaTrigger(trigger: CheckedTrigger, time: number) {

    const distance = this.getDistance(this.sprite.body.center, this.scene.getPlayer().getBody().center);

    if (distance < 20) {
      TriggerManager.fire(trigger.action, this.getTriggerContentObject());
      trigger.lastCheckedOn = time;
    }
  }

  protected getDistance(obj1: Phaser.Math.Vector2, obj2: Phaser.Math.Vector2): number {
    return obj1.distance(obj2);
  }

  protected getTriggerContentObject(): TriggerContents {
    return {
      scene: this.scene,
      player: this.scene.getPlayer(),
      object: this,
      services: {
        progress: GameProgressService.getInstance(),
        ghost: GameGhostService.getInstance(),
        sound: GameSoundService.getInstance(),
        menu: GameMenuService.getInstance(),
        controls: GameControlsService.getInstance(),
      },
      managers: {
        dialog: DialogManager,
        trigger: TriggerManager,
        game: GameManager,
        asset: AssetManager,
        scene: SceneManager,
        level: LevelManager,
      }
    };
  }

  getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }
}
