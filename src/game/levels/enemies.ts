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
      offsetX: 17,
      offsetY: 20,
    },
    meta: {
      enemyType: EnemyLevelObjectType.CHASING,
      chase: {
        speed: 50,
        radius: 9,
      },
    },
    inGhostWorld: false,
  };
}

export function getSpiderEnemyPatroling(pos: MapPosition, pos1: MapPosition, pos2: MapPosition): EnemyLevelObjectData {
  return {
    id: `${Date.now()}-${Math.random()}`,
    type: LevelObjectType.ENEMY,
    isCollideable: false,
    position: pos,
    width: 20,
    height: 20,
    graphics: {
      asset: AssetManager.spriteAssets.enemySpider,
      offsetX: 8,
      offsetY: 20,
    },
    meta: {
      enemyType: EnemyLevelObjectType.PATROLING,
      patrol: {
        speed: 10,
        delay: 100,
        from: pos1,
        to: pos2,
      },
    },
    inGhostWorld: true,
  };
}