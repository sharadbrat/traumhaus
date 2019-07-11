import { GameScene } from '../scenes/GameScene';
import { TriggerManager } from '../TriggerManager';
import { LevelObjectAnimation, LevelObjectData, MapPosition } from './model';
import { LevelObject } from './LevelObject';
import { ENEMY_TRIGGERS_ACTIONS } from './EnemyLevelObject';
import { AssetManager } from '../assets';

export interface LevelLastBossObjectData extends LevelObjectData {
  positions: {
    pos: MapPosition,
    anim: string,
    flip: boolean,
  }[];
}

export const LAST_BOSS_TRIGGERS = {
  DEATH: 'LAST_BOSS_TRIGGERS_DEATH',
};

export class LevelLastBossObject extends LevelObject {

  private isAlive = true;
  private hitPoints: number;
  private readonly allHitPoints: number;

  private bossOptions: LevelLastBossObjectData;
  private isVulnerable = true;
  private currentAnim: string;

  private lastShoot = 0;
  private readonly SHOOT_COOLDOWN = 2300;
  private readonly SHOOT_COOLDOWN_MICRO = 100;
  private readonly radius = 20;

  constructor(scene: GameScene, options: LevelObjectData) {
    super(scene, options);

    this.bossOptions = options as LevelLastBossObjectData;

    this.hitPoints = this.bossOptions.positions.length;
    this.allHitPoints = this.bossOptions.positions.length;

    this.changePosition();
  }

  update(time: number) {
    super.update(time);

    this.updateBoss(time);

    if (this.isCollidingWithPlayer()) {
      TriggerManager.fire(ENEMY_TRIGGERS_ACTIONS.ON_PLAYER_HIT, this.getTriggerContentObject());
    }
  }

  updateBoss(time: number) {
    if (!this.isAlive) {
      return;
    }

    const distance = this.scene.getPlayer().getPosition().distance(this.sprite.body.position);
    if (distance < this.radius * AssetManager.TILE_SIZE) {

      if (time > this.lastShoot + this.SHOOT_COOLDOWN) {
        const pos = this.tilemap.worldToTileXY(this.sprite.body.position.x, this.sprite.body.position.y);
        this.scene.onBossShoot(pos);
        this.lastShoot = time;
        setTimeout(() => {
          this.scene.onBossShoot(pos);
          setTimeout(() => {
            this.scene.onBossShoot(pos);
          }, this.SHOOT_COOLDOWN_MICRO)
        }, this.SHOOT_COOLDOWN_MICRO)
      }
    }

    if (this.isCollidingWithPlayer()) {
      TriggerManager.fire(ENEMY_TRIGGERS_ACTIONS.ON_PLAYER_HIT, this.getTriggerContentObject());
    }
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }

  private isCollidingWithPlayer(): boolean {
    const playerCenter = this.scene.getPlayer().getSprite().body.center;
    const center = this.sprite.body.center;

    const distanceX = Math.abs(center.x - playerCenter.x);
    const distanceY = Math.abs(center.y - playerCenter.y);

    const collideX = distanceX < (this.sprite.body.halfWidth + this.scene.getPlayer().getSprite().body.halfWidth);
    const collideY = distanceY < (this.sprite.body.halfHeight + this.scene.getPlayer().getSprite().body.halfHeight);

    return collideX && collideY;
  }

  public onHit() {
    if (this.isAlive) {
      if (this.isVulnerable) {
        this.hitPoints--;
        if (this.hitPoints < 1) {
          this.isAlive = false;
          this.sprite.setVelocity(0);
          this.sprite.disableBody();
          this.sprite.anims.stop();
          this.sprite.anims.play(`${this.options.graphics.asset.name}__${LevelObjectAnimation.DEATH}`);

          setTimeout(() => {
            TriggerManager.fire(LAST_BOSS_TRIGGERS.DEATH, this.getTriggerContentObject());
          }, 6000);
        } else {
          this.isVulnerable = false;
          this.sprite.setAlpha(0.5);
          this.sprite.setTint(0xFFAAAA);
          setTimeout(() => {
            this.changePosition();
            this.isVulnerable = true;
            this.sprite.setAlpha(1);
            this.sprite.clearTint();
          }, 500);
        }
      }
    }
  }

  private changePosition() {
    const newPosition = this.bossOptions.positions[this.allHitPoints - this.hitPoints];
    const worldPos = this.getWorldPositionFromTilePosition(this.scene, newPosition.pos);
    this.sprite.setPosition(worldPos.x, worldPos.y);
    this.sprite.anims.play(newPosition.anim);
    this.sprite.setFlipX(newPosition.flip);
  }
}
