import { EnemyLevelObjectData, EnemyLevelObjectType, LevelObjectType, MapPosition } from '../entities/model';
import { AssetManager } from '../assets';

export function getSpiderEnemyChasing(pos: MapPosition): EnemyLevelObjectData {
  return {
    id: `${Date.now()}-${Math.random()}`,
    type: LevelObjectType.ENEMY,
    isCollideable: false,
    position: pos,
    width: 12,
    height: 12,
    graphics: {
      asset: AssetManager.spriteAssets.enemySpider,
      offsetX: 16,
      offsetY: 20,
    },
    meta: {
      enemyType: EnemyLevelObjectType.CHASING,
      chase: {
        speed: 50,
        radius: 9,
      },
    },
    inGhostWorld: true,
  };
}

export function getSpiderEnemyPatroling(pos: MapPosition, pos1: MapPosition, pos2: MapPosition): EnemyLevelObjectData {
  return {
    id: `${Date.now()}-${Math.random()}`,
    type: LevelObjectType.ENEMY,
    isCollideable: false,
    position: pos,
    width: 12,
    height: 12,
    graphics: {
      asset: AssetManager.spriteAssets.enemySpider,
      offsetX: 16,
      offsetY: 20,
    },
    meta: {
      enemyType: EnemyLevelObjectType.PATROLING,
      patrol: {
        speed: 50,
        delay: 100,
        from: pos1,
        to: pos2,
      },
    },
    inGhostWorld: true,
  };
}