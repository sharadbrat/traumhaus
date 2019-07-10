import * as Pathfinding from 'pathfinding';

import { LevelObject } from './LevelObject';
import { GameScene } from '../scenes/GameScene';
import { GameGhostService, GameSoundService } from '../../service';
import { TriggerManager } from '../TriggerManager';
import {
  CollisionDetector,
  EnemyLevelObjectData,
  EnemyLevelObjectType,
  LevelObjectAnimation,
  MapPosition
} from './model';
import { AssetManager } from '../assets';
import { LevelMap } from './LevelMap';

export const ENEMY_TRIGGERS_ACTIONS = {
  ON_PLAYER_HIT: 'ON_ENEMY_PLAYER_HIT',
};

export class EnemyLevelObject extends LevelObject {
  private static readonly EPSILON = 1;
  private static readonly UPDATE_COOLDOWN = 100;

  protected options: EnemyLevelObjectData;

  private ghostService: GameGhostService;

  private collision?: CollisionDetector[][];
  private prevPathCalculation = 0;
  private prevDash = 0;
  private collider: Phaser.Physics.Arcade.Collider;
  private isAlive: boolean;

  // PATROLING
  private direction?: MapPosition;
  private oppDirection?: MapPosition;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: GameScene, options: EnemyLevelObjectData) {
    super(scene, options);

    this.options = options;
    this.isAlive = true;

    this.ghostService = GameGhostService.getInstance();

    if (process.env.NODE_ENV === 'development') {
      this.sprite.body.debugShowBody = true;
      this.sprite.body.debugBodyColor = 0xFF0000;
    }

    switch (this.options.meta.enemyType) {
      case EnemyLevelObjectType.DASHING:
        this.initDashingEnemy();
        break;
      case EnemyLevelObjectType.PATROLING:
        this.initPatrolingEnemy();
        break;
      case EnemyLevelObjectType.SHOOTING:
        this.initShootingEnemy();
        break;
      case EnemyLevelObjectType.CHASING:
      default:
        this.initChasingEnemy();
        break;
    }

    if (this.options.inGhostWorld) {
      this.collider = this.scene.physics.add.collider(this.sprite, this.scene.getLevelMap().getGhostCollisionLayer());
    } else {
      this.collider = this.scene.physics.add.collider(this.sprite, this.scene.getLevelMap().getRealCollisionLayer());
    }

  }

  update(time: number) {
    if (!this.isAlive) {
      if (this.emitter && this.emitter.on) {
        this.emitter.stop();
        this.sprite.setBlendMode(Phaser.BlendModes.NORMAL);
      }
      return;
    }

    if (this.options.triggers) {
      this.checkTriggers(time);
    }

    if (this.isInDifferentWorld()) {
      this.sprite.setVelocity(0, 0);
      return;
    }

    switch (this.options.meta.enemyType) {
      case EnemyLevelObjectType.DASHING:
        this.updateDashingEnemy(time);
        break;
      case EnemyLevelObjectType.PATROLING:
        this.updatePatrolingEnemy(time);
        break;
      case EnemyLevelObjectType.SHOOTING:
        this.updateShootingEnemy(time);
        break;
      case EnemyLevelObjectType.CHASING:
      default:
        this.updateChasingEnemy(time);
        break;
    }
  }

  private updateChasingEnemy(time: number) {
    const distance = this.scene.getPlayer().getPosition().distance(this.sprite.body.position);

    const speed = this.options.meta.chase.speed === 0 ? 1 : this.options.meta.chase.speed;
    const cooldown = (EnemyLevelObject.UPDATE_COOLDOWN / speed) * 10;

    if (distance < this.options.meta.chase.radius * AssetManager.TILE_SIZE) {
      if (time - this.prevPathCalculation > cooldown) {
        this.prevPathCalculation = time;
        this.makeChase(this.options.meta.chase.radius, this.options.meta.chase.speed);
      }
    } else {
      this.sprite.setVelocity(0, 0);
    }

    if (this.isCollidingWithPlayer()) {
      TriggerManager.fire(ENEMY_TRIGGERS_ACTIONS.ON_PLAYER_HIT, this.getTriggerContentObject());
    }
  }

  private updateDashingEnemy(time: number) {
    if (this.isCollidingWithPlayer()) {
      TriggerManager.fire(ENEMY_TRIGGERS_ACTIONS.ON_PLAYER_HIT, this.getTriggerContentObject());
    }

    if (time < this.prevDash + this.options.meta.dash.duration) {
      return;
    } else {
      if (this.emitter.on) {
        this.emitter.stop();
        this.sprite.setBlendMode(Phaser.BlendModes.NORMAL);
      }
    }

    const speed = this.options.meta.dash.speed === 0 ? 1 : this.options.meta.dash.speed;
    const distance = this.scene.getPlayer().getPosition().distance(this.sprite.body.position);
    const cooldown = (EnemyLevelObject.UPDATE_COOLDOWN / speed) * 10;

    if (distance < this.options.meta.dash.dashRadius * AssetManager.TILE_SIZE) {
      if (time > this.prevDash + this.options.meta.dash.cooldown) {
        this.prevDash = time;
        this.makeDash(this.options.meta.dash.duration, speed * 3);
        return;
      }
    }

    if (distance < this.options.meta.dash.radius * AssetManager.TILE_SIZE) {
      if (time - this.prevPathCalculation > cooldown) {
        this.prevPathCalculation = time;
        this.makeChase(this.options.meta.dash.radius, this.options.meta.dash.speed);
      }
    } else {
      this.sprite.setVelocity(0, 0);
    }
  }

  private updatePatrolingEnemy(time: number) {

    const speed = this.options.meta.patrol.speed === 0 ? 1 : this.options.meta.patrol.speed;
    const cooldown = (EnemyLevelObject.UPDATE_COOLDOWN / speed) * 10;

    if (time - this.prevPathCalculation > cooldown) {
      this.prevPathCalculation = time;
      this.makePatrol();
    }

    if (this.isCollidingWithPlayer()) {
      TriggerManager.fire(ENEMY_TRIGGERS_ACTIONS.ON_PLAYER_HIT, this.getTriggerContentObject());
    }
  }

  private updateShootingEnemy(time: number) {
// todo: Add impl
  }

  private initDashingEnemy() {
    if (!this.options.meta || !this.options.meta.dash) {
      throw new Error('Can not initialize dashing enemy. Specified incorrect meta.');
    }
    const particles = this.scene.add.particles(this.options.graphics.asset.name);
    this.emitter = particles.createEmitter({
      alpha: {start: 0.7, end: 0, ease: 'Cubic.easeOut'},
      follow: this.sprite,
      quantity: 1,
      lifespan: 200,
      blendMode: Phaser.BlendModes.ADD,
      scaleX: () => (this.sprite.flipX ? -1 : 1),
      emitCallback: (particle: Phaser.GameObjects.Particles.Particle) => {
        particle.frame = this.sprite.frame;
      }
    });
    particles.setDepth(LevelMap.OBJECT_LAYER_DEPTH);
    this.emitter.stop();

    let world;
    if (this.options.inGhostWorld) {
      world = this.scene.getLevelMap().getMapData().ghostWorld;
    } else {
      world = this.scene.getLevelMap().getMapData().realWorld;
    }

    this.collision = world.collisionMap;
  }

  private initPatrolingEnemy() {
    if (!this.options.meta || !this.options.meta.patrol) {
      throw new Error('Can not initialize patroling enemy. Specified incorrect meta.');
    }

    let world;
    if (this.options.inGhostWorld) {
      world = this.scene.getLevelMap().getMapData().ghostWorld;
    } else {
      world = this.scene.getLevelMap().getMapData().realWorld;
    }

    this.collision = world.collisionMap;

    this.direction = this.options.meta.patrol.to;
    this.oppDirection = this.options.meta.patrol.from;
  }

  private initShootingEnemy() {
    // todo: Add impl
  }

  private initChasingEnemy() {
    if (!this.options.meta || !this.options.meta.chase) {
      throw new Error('Can not initialize chasing enemy. Specified incorrect meta.');
    }

    let world;
    if (this.options.inGhostWorld) {
      world = this.scene.getLevelMap().getMapData().ghostWorld;
    } else {
      world = this.scene.getLevelMap().getMapData().realWorld;
    }

    this.collision = world.collisionMap;
  }

  private calcDistanceBetweenTiles(from: MapPosition, to: MapPosition): number {
    const tilemap = this.scene.getLevelMap().getTilemap();
    const fromWorld = tilemap.tileToWorldXY(from.x, from.y);
    const toWorld = tilemap.tileToWorldXY(to.x, to.y);

    return fromWorld.distance(toWorld);
  }

  private findPath(from: MapPosition, to: MapPosition): number[][] {
    const finder = new Pathfinding.AStarFinder({
      allowDiagonal: false,
      dontCrossCorners: true
    });

    return finder.findPath(from.x, from.y, to.x, to.y, new Pathfinding.Grid(this.collision));
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

  private makePatrol() {
    const worldX = this.sprite.body.position.x + this.sprite.body.halfWidth;
    const worldY = this.sprite.body.position.y + this.sprite.body.halfHeight;

    const tilemap = this.scene.getLevelMap().getTilemap();

    const to = this.direction;
    const from = tilemap.worldToTileXY(worldX, worldY);

    const path = this.findPath(from, to);

    let velocityX = 0;
    let velocityY = 0;

    if (path.length > 1) {
      const step = {x: path[1][0], y: path[1][1]};

      const directionX = this.getDirection(worldX, step.x);
      const directionY = this.getDirection(worldY, step.y);

      const norm = this.normalizeVector({x: directionX, y: directionY});

      velocityX = this.options.meta.patrol.speed * norm.x;
      velocityY = this.options.meta.patrol.speed * norm.y;

      this.sprite.setVelocity(velocityX, velocityY);
    }

    const animName = this.getAnimationNameByVelocity(velocityX, velocityY, !!this.options.graphics.asset.animations.walk_left);
    this.sprite.anims.play(animName, true);
    this.sprite.setFlipX(velocityX > 0);

    const distance = this.calcDistanceBetweenTiles(from, to);

    if (distance < AssetManager.TILE_SIZE / 2) {
      const temp = this.direction;
      this.direction = this.oppDirection;
      this.oppDirection = temp;
    }
  }

  private makeChase(radius: number, speed: number) {
    const worldX = this.sprite.body.position.x + this.sprite.body.halfWidth;
    const worldY = this.sprite.body.position.y + this.sprite.body.halfHeight;

    const tilemap = this.scene.getLevelMap().getTilemap();

    const {x, y} = this.scene.getPlayer().getPosition();
    const to = tilemap.worldToTileXY(x, y);
    const from = tilemap.worldToTileXY(worldX, worldY);

    try {
      const path = this.findPath(from, to);

      let velocityX = 0;
      let velocityY = 0;

      if (path.length < radius * 3) {
        if (path.length > 3) {
          const step = {x: path[1][0], y: path[1][1]};

          const directionX = this.getDirection(worldX, step.x);
          const directionY = this.getDirection(worldY, step.y);

          const norm = this.normalizeVector({x: directionX, y: directionY});

          velocityX = speed * norm.x;
          velocityY = speed * norm.y;

          this.sprite.setVelocity(velocityX, velocityY);
        } else if (!this.isCollidingWithPlayer()) {
          const dir = this.scene.getPlayer().getPosition().subtract(this.sprite.body.position);

          const norm = this.normalizeVector(dir);

          velocityX = speed * norm.x;
          velocityY = speed * norm.y;
        }

        this.sprite.setVelocity(velocityX, velocityY);
      }

      const animName = this.getAnimationNameByVelocity(velocityX, velocityY, !!this.options.graphics.asset.animations.walk_left);
      this.sprite.anims.play(animName, true);
      this.sprite.setFlipX(velocityX > 0);
    } catch (e) {
      console.error('Couldn\'t calculate path for chasing enemy, do nothing');
    }
  }

  private normalizeVector(vec: MapPosition): MapPosition {

    let norm = Math.abs(vec.x) + Math.abs(vec.y);
    if (norm === 0) {
      norm = 1;
    }

    const x = vec.x / norm;
    const y = vec.y / norm;

    return {x, y};
  }

  private getDirection(from: number, to: number): number {

    let directionX;
    const number = this.scene.getLevelMap().getTilemap().tileToWorldX(to) + (AssetManager.TILE_SIZE / 2);
    if (from - number < - EnemyLevelObject.EPSILON) {
      directionX = 1;
    } else if (from - number > EnemyLevelObject.EPSILON) {
      directionX = -1;
    } else {
      directionX = 0
    }

    return directionX;
  }

  private getAnimationNameByVelocity(velocityX: number, velocityY: number, hasWalkLeftAnim = false): string  {
    let anim = '';

    if (velocityY > Math.abs(velocityX)) {
      anim = `${this.options.graphics.asset.name}__${this.options.graphics.asset.animations[LevelObjectAnimation.WALK].name}`;
    } else if (velocityY < -Math.abs(velocityX)) {
      anim = `${this.options.graphics.asset.name}__${this.options.graphics.asset.animations[LevelObjectAnimation.WALK_BACK].name}`;
    } else if (velocityX !== 0) {
      if (hasWalkLeftAnim) {
        anim = `${this.options.graphics.asset.name}__${this.options.graphics.asset.animations[LevelObjectAnimation.WALK_LEFT].name}`;
      } else {
        anim = `${this.options.graphics.asset.name}__${this.options.graphics.asset.animations[LevelObjectAnimation.WALK].name}`;
      }
    } else {
      anim = `${this.options.graphics.asset.name}__${this.options.graphics.asset.animations[LevelObjectAnimation.IDLE].name}`;
    }

    return anim;
  }

  public onHit() {
    this.isAlive = false;
    this.sprite.setVelocity(0);
    this.sprite.disableBody();
    this.sprite.anims.stop();
    this.sprite.anims.play(`${this.options.graphics.asset.name}__${LevelObjectAnimation.DEATH}`);
    setTimeout(() => {
      this.scene.tweens.add({
        targets: this.sprite,
        alpha: 0,
        duration: 10000
      });
    }, 5000);
    setTimeout(() => {
      this.sprite.destroy();
    }, 15000);
  }

  private makeDash(duration: number, speed: number) {
    const playerPos = this.scene.getPlayer().getPosition();
    const velocityX = this.sprite.body.position.x - playerPos.x;
    const velocityY = this.sprite.body.position.y - playerPos.y;

    GameSoundService.getInstance().playSfx(AssetManager.soundAssets.dash.name);
    this.sprite.setVelocity(-velocityX, -velocityY);
    this.sprite.body.velocity.normalize().scale(speed);
    this.emitter.start();
    this.sprite.setBlendMode(Phaser.BlendModes.ADD);
  }
}