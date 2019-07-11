import {
  EnemyLevelObjectData,
  EnemyLevelObjectType,
  LevelObjectAnimation,
  LevelObjectType,
  MapPosition
} from '../entities/model';
import { AssetManager, BOSS_GRAPHICAL_ASSET_ID } from '../assets';
import { LevelLastBossObjectData } from '../entities';

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
export function getSpiderParkEnemyChasing(id: string, pos: MapPosition): EnemyLevelObjectData {
  return {
    id: id,
    type: LevelObjectType.ENEMY,
    isCollideable: false,
    position: pos,
    width: 12,
    height: 12,
    graphics: {
      asset: AssetManager.spriteAssets.enemySpiderPark,
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

export function getGhostEnemyDashing(id: string, pos: MapPosition): EnemyLevelObjectData {
  return {
    id: id,
    type: LevelObjectType.ENEMY,
    isCollideable: false,
    position: pos,
    width: 12,
    height: 12,
    graphics: {
      asset: AssetManager.spriteAssets.enemyGhost,
      offsetX: 10,
      offsetY: 20,
    },
    meta: {
      enemyType: EnemyLevelObjectType.DASHING,
      dash: {
        speed: 70,
        radius: 8,
        dashRadius: 5,
        cooldown: 2000,
        duration: 300,
      }
    },
    inGhostWorld: true,
  };
}

export function getBoss(): LevelLastBossObjectData {
  return {
    id: 'boss',
    type: LevelObjectType.LAST_BOSS,
    isCollideable: false,
    position: {x: 29, y: 13},
    width: 30,
    height: 30,
    graphics: {
      asset: AssetManager.spriteAssets.boss,
      offsetX: 10,
      offsetY: 16,
    },
    inGhostWorld: true,
    positions: [
      {
        pos: {x: 29, y: 13},
        anim: `${BOSS_GRAPHICAL_ASSET_ID}__${LevelObjectAnimation.IDLE_LEFT}`,
        flip: false,
      },
      {
        pos: {x: 20, y: 21},
        anim: `${BOSS_GRAPHICAL_ASSET_ID}__${LevelObjectAnimation.IDLE_LEFT}`,
        flip: true,
      },
      {
        pos: {x: 20, y: 13},
        anim: `${BOSS_GRAPHICAL_ASSET_ID}__${LevelObjectAnimation.IDLE_LEFT}`,
        flip: true,
      },
      {
        pos: {x: 29, y: 21},
        anim: `${BOSS_GRAPHICAL_ASSET_ID}__${LevelObjectAnimation.IDLE_LEFT}`,
        flip: false,
      },
      {
        pos: {x: 25, y: 13},
        anim: `${BOSS_GRAPHICAL_ASSET_ID}__${LevelObjectAnimation.IDLE}`,
        flip: false,
      },
    ]
  };
}
