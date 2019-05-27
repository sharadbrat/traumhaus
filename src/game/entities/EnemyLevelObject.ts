import * as Pathfinding from 'pathfinding';

import { CheckedTrigger, LevelObject } from './LevelObject';
import { GameScene } from '../scenes/GameScene';
import { GameGhostService } from '../../service';
import { TriggerManager } from '../TriggerManager';
import { CollisionDetector, EnemyLevelObjectData, EnemyLevelObjectType, MapPosition } from './model';

export const ENEMY_TRIGGERS_ACTIONS = {
  ON_PLAYER_HIT: 'ON_ENEMY_PLAYER_HIT',
};

export class EnemyLevelObject extends LevelObject {
  private static readonly EPSILON = 1;

  protected options: EnemyLevelObjectData;

  private ghostService: GameGhostService;

  private collision?: CollisionDetector[][];

  private direction?: MapPosition;
  private oppDirection?: MapPosition;

  private prevPathCalculation = 0;

  private enemyTriggers: {
    [id: string]: CheckedTrigger,
  };

  constructor(scene: GameScene, options: EnemyLevelObjectData) {
    super(scene, options);

    this.options = options;

    // this.sprite.setMass(10);
    // this.sprite.setFriction(1000000);

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
  }

  update(time: number) {
    super.update(time);

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
// todo: Add impl
  }

  private updateDashingEnemy(time: number) {
// todo: Add impl
  }

  private updatePatrolingEnemy(time: number) {
    if (this.isInDifferentWorld()) {
      this.sprite.setVelocity(0, 0);
      return;
    }

    if (time - this.prevPathCalculation > 100) {
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
    if (this.ghostService.isGhostMode()) {
      world = this.scene.getLevelMap().getMapData().ghostWorld;
    } else {
      world = this.scene.getLevelMap().getMapData().realWorld;
    }

    this.collision = world.collisionMap;

    this.direction = this.options.meta.patrol.to;
    this.oppDirection = this.options.meta.patrol.from;

    this.sprite.debugShowBody = true;
    this.sprite.debugBodyColor = 0xFF0000;
  }

  private initShootingEnemy() {
    // todo: Add impl
  }

  private initChasingEnemy() {
    // todo: Add impl
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

      let directionX;
      const number = tilemap.tileToWorldX(step.x) + 8;
      if (worldX - number < - EnemyLevelObject.EPSILON) {
        directionX = 1;
      } else if (worldX - number > EnemyLevelObject.EPSILON) {
        directionX = -1;
      } else {
        directionX = 0
      }

      let directionY;
      const number1 = tilemap.tileToWorldY(step.y) + 8;

      if (worldY - number1 < - EnemyLevelObject.EPSILON) {
        directionY = 1;
      } else if (worldY - number1 > EnemyLevelObject.EPSILON) {
        directionY = -1;
      } else {
        directionY = 0
      }

      const velocityX = this.options.meta.patrol.speed * directionX;
      const velocityY = this.options.meta.patrol.speed * directionY;

      this.sprite.setVelocity(velocityX, velocityY);
    }

    const distance = this.calcDistanceBetweenTiles(from, to);

    if (distance < 20) {
      const temp = this.direction;
      this.direction = this.oppDirection;
      this.oppDirection = temp;
    }
  }
}