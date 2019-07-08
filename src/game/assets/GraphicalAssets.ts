import { Asset } from './AssetManager';
import { LevelObjectAnimation } from '../entities/model';

export const STAGE_1_REAL_GRAPHICAL_ASSET_ID = 'STAGE_1_REAL_GRAPHICAL_ASSET';
export const STAGE_1_GHOST_GRAPHICAL_ASSET_ID = 'STAGE_1_GHOST_GRAPHICAL_ASSET';
export const STAGE_2_REAL_GRAPHICAL_ASSET_ID = 'STAGE_2_REAL_GRAPHICAL_ASSET';
export const STAGE_2_GHOST_GRAPHICAL_ASSET_ID = 'STAGE_2_GHOST_GRAPHICAL_ASSET';
export const STAGE_3_REAL_GRAPHICAL_ASSET_ID = 'STAGE_3_REAL_GRAPHICAL_ASSET';
export const STAGE_3_GHOST_GRAPHICAL_ASSET_ID = 'STAGE_3_GHOST_GRAPHICAL_ASSET';
export const STAGE_4_REAL_GRAPHICAL_ASSET_ID = 'STAGE_4_REAL_GRAPHICAL_ASSET';
export const STAGE_4_GHOST_GRAPHICAL_ASSET_ID = 'STAGE_4_GHOST_GRAPHICAL_ASSET';
export const STAGE_5_REAL_GRAPHICAL_ASSET_ID = 'STAGE_5_REAL_GRAPHICAL_ASSET';
export const STAGE_5_GHOST_GRAPHICAL_ASSET_ID = 'STAGE_5_GHOST_GRAPHICAL_ASSET';

export const PLAYER_GRAPHICAL_ASSET_ID = 'PLAYER_GRAPHICAL_ASSET';
export const GHOST_PLAYER_GRAPHICAL_ASSET_ID = 'GHOST_PLAYER_GRAPHICAL_ASSET';
export const ENEMY_SPIDER_GRAPHICAL_ASSET_ID = 'ENEMY_SPIDER_GRAPHICAL_ASSET';
export const PROFESSOR_GRAPHICAL_ASSET_ID = 'PROFESSOR_GRAPHICAL_ASSET';
export const STUDENT_CARD_GRAPHICAL_ASSET_ID = 'STUDENT_CARD_GRAPHICAL_ASSET';
export const TRANSFORM_ESSENCE_GRAPHICAL_ASSET_ID = 'TRANSFORM_ESSENCE_GRAPHICAL_ASSET';
export const SHOOTING_OBJECT_GRAPHICAL_ASSET_ID = 'SHOOTING_OBJECT_GRAPHICAL_ASSET';
export const INVISIBLE_GRAPHICAL_ASSET_ID = 'INVISIBLE_GRAPHICAL_ASSET';
export const PROJECTILE_GRAPHICAL_ASSET_ID = 'PROJECTILE_GRAPHICAL_ASSET';
export const GLOWING_GRAPHICAL_ASSET_ID = 'GLOWING_GRAPHICAL_ASSET';

export const UTIL_GRAPHICAL_ASSET_ID = 'UTIL_GRAPHICAL_ASSET';

export type Animation = Phaser.Animations.Types.GenerateFrameNumbers & {name: string, frameRate: number, repeat: boolean};

export interface GraphicalAsset extends Asset {
  name: string;
  width: number;
  height: number;
  file: string;
  indices?: any;
}

export type AnimationMap = {
  [id in LevelObjectAnimation]?: Animation;
};

export interface SpriteAsset extends GraphicalAsset {
  animations: AnimationMap;
}

// TILE ASSETS

export const stage1realGraphicalAsset: GraphicalAsset = {
  name: STAGE_1_REAL_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/stage-1.png',
};

export const stage1ghostGraphicalAsset: GraphicalAsset = {
  name: STAGE_1_GHOST_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/stage-1-ghost.png',
};

export const stage2realGraphicalAsset: GraphicalAsset = {
  name: STAGE_2_REAL_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/stage-2.png',
};

export const stage2ghostGraphicalAsset: GraphicalAsset = {
  name: STAGE_2_GHOST_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/stage-2-ghost.png',
};

export const stage3realGraphicalAsset: GraphicalAsset = {
  name: STAGE_3_REAL_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/stage-3.png',
};

export const stage3ghostGraphicalAsset: GraphicalAsset = {
  name: STAGE_3_GHOST_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/stage-3-ghost.png',
};

export const stage4realGraphicalAsset: GraphicalAsset = {
  name: STAGE_4_REAL_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/ilm2.png',
};

export const stage4ghostGraphicalAsset: GraphicalAsset = {
  name: STAGE_4_GHOST_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/ilm2g.png',
};

export const stage5realGraphicalAsset: GraphicalAsset = {
  name: STAGE_5_REAL_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/lib.png',
};

export const stage5ghostGraphicalAsset: GraphicalAsset = {
  name: STAGE_5_GHOST_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/libg.png',
};

// SPRITE ASSETS

export const playerGraphicalAsset: SpriteAsset = {
  name: PLAYER_GRAPHICAL_ASSET_ID,
  width: 32,
  height: 32,
  file: '/tiles/Player.png',
  animations: {
    [LevelObjectAnimation.IDLE]: {
      name: LevelObjectAnimation.IDLE,
      start: 0,
      end: 7,
      frameRate: 6,
      repeat: true
    },
    [LevelObjectAnimation.WALK]: {
      name: LevelObjectAnimation.WALK,
      start: 8,
      end: 13,
      frameRate: 10,
      repeat: true
    },
    [LevelObjectAnimation.WALK_BACK]: {
      name: LevelObjectAnimation.WALK_BACK,
      start: 16,
      end: 21,
      frameRate: 10,
      repeat: true
    },
    // Ideally attacks should be five frames at 30fps to
    // align with the attack duration of 165ms
    [LevelObjectAnimation.SLASH]: {
      name: LevelObjectAnimation.SLASH,
      start: 8,
      end: 13,
      frameRate: 6,
      repeat: false
    },
    [LevelObjectAnimation.SLASH_UP]: {
      name: LevelObjectAnimation.SLASH_UP,
      start: 8,
      end: 13,
      frameRate: 6,
      repeat: false
    },
    [LevelObjectAnimation.SLASH_DOWN]: {
      name: LevelObjectAnimation.SLASH_DOWN,
      start: 16,
      end: 21,
      frameRate: 6,
      repeat: false
    },
  }
};

export const projectileGraphicalAsset: SpriteAsset = {
  name: PROJECTILE_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 32,
  file: '/tiles/projectile.png',
  animations: {
    [LevelObjectAnimation.IDLE]: {
      name: LevelObjectAnimation.IDLE,
      frames: [0, 1, 2, 1],
      frameRate: 6,
      repeat: true
    },
    [LevelObjectAnimation.DEATH]: {
      name: LevelObjectAnimation.DEATH,
      frames: [3, 4, 5],
      frameRate: 10,
      repeat: false
    },
  },
};

export const professorGraphicalAsset: SpriteAsset = {
  name: PROFESSOR_GRAPHICAL_ASSET_ID,
  width: 32,
  height: 32,
  file: '/tiles/NPC_Prof.png',
  animations: {
    [LevelObjectAnimation.IDLE]: {
      name: LevelObjectAnimation.IDLE,
      frames: [0, 1, 2, 1],
      frameRate: 6,
      repeat: true
    }
  }
};

export const invisibleGraphicalAsset: SpriteAsset = {
  name: INVISIBLE_GRAPHICAL_ASSET_ID,
  width: 10,
  height: 10,
  file: '/tiles/sprite-invisible.png',
  animations: {
    [LevelObjectAnimation.IDLE]: {
      name: LevelObjectAnimation.IDLE,
      start: 0x00,
      end: 0x00,
      frameRate: 6,
      repeat: true
    }
  }
};

export const glowingGraphicalAsset: SpriteAsset = {
  name: GLOWING_GRAPHICAL_ASSET_ID,
  width: 32,
  height: 16,
  file: '/tiles/Indicator_Glow.png',
  animations: {
    [LevelObjectAnimation.IDLE]: {
      name: LevelObjectAnimation.IDLE,
      frames: [0, 1, 2, 2, 1, 0],
      frameRate: 7,
      repeat: true
    }
  }
};

export const studentCardGraphicalAsset: SpriteAsset = {
  name: STUDENT_CARD_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/sprite-student-card.png',
  animations: {
    [LevelObjectAnimation.IDLE]: {
      name: LevelObjectAnimation.IDLE,
      start: 0x00,
      end: 0x03,
      frameRate: 3,
      repeat: true
    }
  }
};

export const shootingObjectGraphicalAsset: SpriteAsset = {
  name: SHOOTING_OBJECT_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/sprite-shooting-object.png',
  animations: {
    [LevelObjectAnimation.IDLE]: {
      name: LevelObjectAnimation.IDLE,
      start: 0x00,
      end: 0x03,
      frameRate: 3,
      repeat: true
    }
  }
};

export const transformEssenceGraphicalAsset: SpriteAsset = {
  name: TRANSFORM_ESSENCE_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/sprite-transform-essence.png',
  animations: {
    [LevelObjectAnimation.IDLE]: {
      name: LevelObjectAnimation.IDLE,
      start: 0x00,
      end: 0x03,
      frameRate: 3,
      repeat: true
    }
  }
};

export const ghostPlayerGraphicalAsset: SpriteAsset = {
  name: GHOST_PLAYER_GRAPHICAL_ASSET_ID,
  width: 32,
  height: 32,
  file: '/tiles/GhostPlayer.png',
  animations: {
    [LevelObjectAnimation.IDLE]: {
      name: LevelObjectAnimation.IDLE,
      start: 0,
      end: 3,
      frameRate: 6,
      repeat: true
    },
    [LevelObjectAnimation.WALK]: {
      name: LevelObjectAnimation.WALK,
      start: 4,
      end: 7,
      frameRate: 6,
      repeat: true
    },
    [LevelObjectAnimation.WALK_BACK]: {
      name: LevelObjectAnimation.WALK_BACK,
      start: 8,
      end: 11,
      frameRate: 6,
      repeat: true
    },
    // Ideally attacks should be five frames at 30fps to
    // align with the attack duration of 165ms
    [LevelObjectAnimation.SLASH]: {
      name: LevelObjectAnimation.SLASH,
      start: 12,
      end: 15,
      frameRate: 30,
      repeat: false
    },
    [LevelObjectAnimation.SLASH_UP]: {
      name: LevelObjectAnimation.SLASH_UP,
      start: 16,
      end: 19,
      frameRate: 30,
      repeat: false
    },
    [LevelObjectAnimation.SLASH_DOWN]: {
      name: LevelObjectAnimation.SLASH_DOWN,
      start: 20,
      end: 23,
      frameRate: 30,
      repeat: false
    },
    [LevelObjectAnimation.HIT]: {
      name: LevelObjectAnimation.HIT,
      start: 0,
      end: 3,
      frameRate: 6,
      repeat: false
    },
  }
};

export const enemySpiderGraphicalAsset: SpriteAsset = {
  name: ENEMY_SPIDER_GRAPHICAL_ASSET_ID,
  width: 48,
  height: 48,
  file: '/tiles/Enemy_1_Spider.png',
  animations: {
    [LevelObjectAnimation.IDLE]: {
      name: LevelObjectAnimation.IDLE,
      frames: [0x03, 0x04, 0x05, 0x04],
      frameRate: 6,
      repeat: true
    },
    [LevelObjectAnimation.WALK]: {
      name: LevelObjectAnimation.WALK,
      frames: [0x00, 0x01, 0x02],
      frameRate: 5,
      repeat: true
    },
    [LevelObjectAnimation.WALK_BACK]: {
      name: LevelObjectAnimation.WALK_BACK,
      frames: [0x06, 0x07, 0x08],
      frameRate: 5,
      repeat: true
    },
    [LevelObjectAnimation.WALK_LEFT]: {
      name: LevelObjectAnimation.WALK_LEFT,
      frames: [0x03, 0x04, 0x05],
      frameRate: 5,
      repeat: true
    },
    [LevelObjectAnimation.DEATH]: {
      name: LevelObjectAnimation.DEATH,
      start: 0x09,
      end: 0x11,
      frameRate: 3,
      repeat: false
    },
  }
};

export const utilGraphicalAsset: GraphicalAsset = {
  name: UTIL_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/UtilTiles.png',
  indices: {
    black: 0x00,
    transparent: 0x01,
    blue: 0x02,
    red: 0x03,
    orange: 0x04,
    green: 0x05,
    pink: 0x06,
    purple: 0x07,
  },
};
