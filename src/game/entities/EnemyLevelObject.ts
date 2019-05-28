import * as Pathfinding from 'pathfinding';

import { LevelObject } from './LevelObject';
import { GameScene } from '../scenes/GameScene';
import { GameGhostService } from '../../service';
import { TriggerManager } from '../TriggerManager';
import { CollisionDetector, EnemyLevelObjectData, EnemyLevelObjectType, MapPosition } from './model';
import { AssetManager } from '../assets';

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
  private collider: Phaser.Physics.Arcade.Collider;

  // PATROLING
  private direction?: MapPosition;
  private oppDirection?: MapPosition;

  constructor(scene: GameScene, options: EnemyLevelObjectData) {
    super(scene, options);

    this.options = options;

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
    if (this.isInDifferentWorld()) {
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
        this.makeChase();
      }
    } else {
      this.sprite.setVelocity(0, 0);
    }

    if (this.isCollidingWithPlayer()) {
      TriggerManager.fire(ENEMY_TRIGGERS_ACTIONS.ON_PLAYER_HIT, this.getTriggerContentObject());
    }
  }

  private updateDashingEnemy(time: number) {
// todo: Add impl
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
    // todo: Add impl
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

    if (path.length > 1) {
      const step = {x: path[1][0], y: path[1][1]};

      const directionX = this.getDirection(worldX, step.x);
      const directionY = this.getDirection(worldY, step.y);

      const norm = this.normalizeVector({x: directionX, y: directionY});

      const velocityX = this.options.meta.patrol.speed * norm.x;
      const velocityY = this.options.meta.patrol.speed * norm.y;

      this.sprite.setVelocity(velocityX, velocityY);
    }

    const distance = this.calcDistanceBetweenTiles(from, to);

    if (distance < AssetManager.TILE_SIZE / 2) {
      const temp = this.direction;
      this.direction = this.oppDirection;
      this.oppDirection = temp;
    }
  }

  private makeChase() {
    const worldX = this.sprite.body.position.x + this.sprite.body.halfWidth;
    const worldY = this.sprite.body.position.y + this.sprite.body.halfHeight;

    const tilemap = this.scene.getLevelMap().getTilemap();

    const {x, y} = this.scene.getPlayer().getPosition();
    const to = tilemap.worldToTileXY(x, y);
    const from = tilemap.worldToTileXY(worldX, worldY);

    const path = this.findPath(from, to);

    if (path.length > 3) {
      const step = {x: path[1][0], y: path[1][1]};

      const directionX = this.getDirection(worldX, step.x);
      const directionY = this.getDirection(worldY, step.y);

      const norm = this.normalizeVector({x: directionX, y: directionY});

      const velocityX = this.options.meta.chase.speed * norm.x;
      const velocityY = this.options.meta.chase.speed * norm.y;

      this.sprite.setVelocity(velocityX, velocityY);
    } else if (!this.isCollidingWithPlayer()) {
      const dir = this.scene.getPlayer().getPosition().subtract(this.sprite.body.position);

      const norm = this.normalizeVector(dir);

      const velocityX = this.options.meta.chase.speed * norm.x;
      const velocityY = this.options.meta.chase.speed * norm.y;
      this.sprite.setVelocity(velocityX, velocityY);
    } else {
      this.sprite.setVelocity(0);
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
}