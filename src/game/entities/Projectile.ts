import Phaser from 'phaser';

import { AssetManager, SHOOT_SOUND_ASSET_ID, SpriteAsset } from '../assets';
import { GameGhostService, GameSoundService } from '../../service';
import { LevelMap } from './LevelMap';
import { LevelObjectAnimation, LevelObjectType, MapPosition } from './model';
import { GameScene } from '../scenes/GameScene';
import { EnemyLevelObject } from './EnemyLevelObject';

const SPEED = 200;
const ACC = 400;
const MAX_SPEED = 600;

export class Projectile {
  public readonly id: string;
  private readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly body: Phaser.Physics.Arcade.Body;
  private scene: GameScene;

  private ghostService: GameGhostService;
  private asset: SpriteAsset;
  private collider: Phaser.Physics.Arcade.Collider;

  constructor(id: string, x: number, y: number, direction: MapPosition, scene: GameScene) {
    this.scene = scene;
    this.id = id;

    this.ghostService = GameGhostService.getInstance();

    this.asset = AssetManager.spriteAssets.projectile;
    this.sprite = this.setupSprite({x, y}, direction, this.asset);

    this.body = this.sprite.body as Phaser.Physics.Arcade.Body;

    this.collider = this.scene.physics.add.collider(this.sprite, this.scene.getLevelMap().getGhostCollisionLayer(), this.onCollide);

    GameSoundService.getInstance().playSfx(SHOOT_SOUND_ASSET_ID);
  }

  update() {
    if (!this.ghostService.isGhostMode()) {
      this.destroy();
      return;
    }

    const objects = this.scene.getCurrentObjects();

    if (objects) {
      objects
        .filter(el => el.getOptions().type === LevelObjectType.ENEMY)
        .forEach((el) => {
          if (this.scene.physics.overlap(el.getSprite(), this.sprite)) {
            (el as EnemyLevelObject).onHit();
            this.destroy();
          }
        })
    }
  }

  private setupSprite(pos: MapPosition, dir: MapPosition, asset: SpriteAsset) {
    const offsetX = 4;
    const offsetY = 10;

    const sizeX = 8;
    const sizeY = 8;

    const sprite = this.scene.physics.add.sprite(pos.x + sizeX, pos.y, asset.name, 0);
    sprite.setSize(sizeX, sizeY);
    sprite.setOffset(offsetX, offsetY);
    sprite.setVelocity(dir.x * SPEED, dir.y * SPEED);
    sprite.setAcceleration(dir.x * ACC, dir.y * ACC);
    sprite.setMaxVelocity(MAX_SPEED);
    sprite.setScale(1.5);
    sprite.setTint(0xFFFFFF);
    sprite.setAngle(this.getRotation(dir));
    sprite.anims.play(`${asset.name}__${asset.animations[LevelObjectAnimation.IDLE].name}`);
    sprite.setDepth(LevelMap.OBJECT_LAYER_DEPTH);

    return sprite;
  }

  public destroy() {
    this.scene.removeProjectile(this.id);
    this.sprite.anims.play(`${this.asset.name}__${this.asset.animations[LevelObjectAnimation.DEATH].name}`);
    this.sprite.setVelocity(0);
    this.sprite.setAcceleration(0);
    this.sprite.disableBody();

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      duration: 300
    });

    setTimeout(() => {
      this.collider.destroy();
      this.sprite.destroy();
    }, 300);
  }

  private onCollide = () => {
    this.destroy();
  };

  private getRotation(dir: MapPosition): number {
    if (dir.x > 0 && dir.y > 0) {
      return 45;
    } else if (dir.x > 0 && dir.y === 0) {
      return 0;
    } else if (dir.x > 0 && dir.y < 0) {
      return -45;
    } else if (dir.x === 0 && dir.y < 0) {
      return -90;
    } else if (dir.x < 0 && dir.y < 0) {
      return -135;
    } else if (dir.x < 0 && dir.y === 0) {
      return -180;
    } else if (dir.x < 0 && dir.y > 0) {
      return -225;
    } else if (dir.x === 0 && dir.y > 0) {
      return -270;
    }
    return 0;
  }
}
