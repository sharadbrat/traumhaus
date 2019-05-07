import { LevelObjectData, MapPosition, Trigger, TriggerEvent } from './LevelMap';
import { GameScene } from '../scenes/GameScene';
import { TriggerManager } from '../TriggerManager';

export class LevelObject {

  protected sprite: Phaser.Physics.Arcade.Sprite;
  protected scene: GameScene;
  protected isVisible: boolean;
  protected options: LevelObjectData;

  protected position: MapPosition;
  protected tilemap: Phaser.Tilemaps.Tilemap;

  constructor(scene: GameScene, options: LevelObjectData) {
    this.scene = scene;
    this.options = options;
    this.sprite = this.setupSprite(options);
    this.tilemap = this.scene.getLevelMap().getTilemap();

    this.position = options.position;
  }

  update(time: number) {
    // time in miliseconds
    if (this.options.triggers) {
      this.checkTriggers();
    }
  }

  public setVisible(val: boolean) {
    this.isVisible = val;
    this.sprite.setVisible(this.isVisible);
  }

  protected setupSprite(options: LevelObjectData) {
    const { asset, offsetX, offsetY } = options.graphics;
    const {x, y} = this.getWorldPositionFromTilePosition(this.scene, options.position);

    const sprite = this.scene.physics.add.sprite(x + options.width / 2, y, asset.name, 0);
    sprite.setSize(options.width, options.height);
    sprite.setOffset(offsetX, offsetY);
    const key = `${asset.name}__${asset.animations.idle.name}`;
    sprite.anims.play(key);

    return sprite;
  }

  protected getWorldPositionFromTilePosition(scene: GameScene, position: MapPosition): MapPosition {
    return {
      x: scene.getLevelMap().getTilemap().tileToWorldX(position.x),
      y: scene.getLevelMap().getTilemap().tileToWorldY(position.y)
    };
  }

  protected checkTriggers() {
    if (this.options.triggers) {
      this.options.triggers.forEach(el => this.checkTrigger(el));
    }
  }

  protected checkTrigger(trigger: Trigger) {
    if (trigger.event === TriggerEvent.ON_COLLIDE) {
      const player = this.scene.getPlayer();

      if (this.scene.physics.collide(player.getSprite(), this.sprite)) {
        TriggerManager.fire(trigger.action, this.scene, this, player);
      }

    } else if (trigger.event === TriggerEvent.ON_ACTION) {
      const player = this.scene.getPlayer();

      const distance = this.getDistance(this.sprite.body.center, player.getBody().center);

      if (player.getKeys().u.isDown && distance < 20) {
        TriggerManager.fire(trigger.action, this.scene, this, player);
      }

    }
  }

  protected getDistance(obj1: Phaser.Math.Vector2, obj2: Phaser.Math.Vector2): number {
    return obj1.distance(obj2);
  }
}
