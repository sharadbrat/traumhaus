import { Asset } from './AssetManager';
import { LevelObjectAnimation } from '../entities/model';

export const STAGE_1_REAL_GRAPHICAL_ASSET_ID = 'STAGE_1_REAL_GRAPHICAL_ASSET';
export const STAGE_1_GHOST_GRAPHICAL_ASSET_ID = 'STAGE_1_GHOST_GRAPHICAL_ASSET';

export const PLAYER_GRAPHICAL_ASSET_ID = 'PLAYER_GRAPHICAL_ASSET';
export const GHOST_PLAYER_GRAPHICAL_ASSET_ID = 'GHOST_PLAYER_GRAPHICAL_ASSET';
export const PROFESSOR_GRAPHICAL_ASSET_ID = 'PROFESSOR_GRAPHICAL_ASSET';

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
  file: '/tiles/Stage1_Tiles-1.png',
};

export const stage1ghostGraphicalAsset: GraphicalAsset = {
  name: STAGE_1_GHOST_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/Stage1_Tiles_Ghostworld.png',
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
      start: 0x01,
      end: 0x07,
      frameRate: 6,
      repeat: true
    },
    [LevelObjectAnimation.WALK]: {
      name: LevelObjectAnimation.WALK,
      start: 0x08,
      end: 0x0d,
      frameRate: 10,
      repeat: true
    },
    [LevelObjectAnimation.WALK_BACK]: {
      name: LevelObjectAnimation.WALK_BACK,
      start: 0x10,
      end: 0x15,
      frameRate: 10,
      repeat: true
    },
    // Ideally attacks should be five frames at 30fps to
    // align with the attack duration of 165ms
    [LevelObjectAnimation.SLASH]: {
      name: LevelObjectAnimation.SLASH,
      frames: [0x18, 0x19, 0x19, 0x1a, 0x1b],
      frameRate: 30,
      repeat: false
    },
    [LevelObjectAnimation.SLASH_UP]: {
      name: LevelObjectAnimation.SLASH_UP,
      frames: [0x21, 0x22, 0x22, 0x23, 0x24],
      frameRate: 30,
      repeat: false
    },
    [LevelObjectAnimation.SLASH_DOWN]: {
      name: LevelObjectAnimation.SLASH_DOWN,
      frames: [0x29, 0x2a, 0x2a, 0x2b, 0x2c],
      frameRate: 30,
      repeat: false
    },
    [LevelObjectAnimation.HIT]: {
      name: LevelObjectAnimation.HIT,
      start: 0x30,
      end: 0x34,
      frameRate: 24,
      repeat: false
    },
  }
};

export const professorGraphicalAsset: SpriteAsset = {
  name: PROFESSOR_GRAPHICAL_ASSET_ID,
  width: 32,
  height: 32,
  file: '/tiles/NPC_Prof.png',
  animations: {
    [LevelObjectAnimation.IDLE]: {
      name: LevelObjectAnimation.IDLE,
      start: 0x00,
      end: 0x02,
      frameRate: 6,
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
      start: 0x01,
      end: 0x07,
      frameRate: 6,
      repeat: true
    },
    [LevelObjectAnimation.WALK]: {
      name: LevelObjectAnimation.WALK,
      start: 0x08,
      end: 0x0d,
      frameRate: 10,
      repeat: true
    },
    [LevelObjectAnimation.WALK_BACK]: {
      name: LevelObjectAnimation.WALK_BACK,
      start: 0x10,
      end: 0x15,
      frameRate: 10,
      repeat: true
    },
    // Ideally attacks should be five frames at 30fps to
    // align with the attack duration of 165ms
    [LevelObjectAnimation.SLASH]: {
      name: LevelObjectAnimation.SLASH,
      frames: [0x18, 0x19, 0x19, 0x1a, 0x1b],
      frameRate: 30,
      repeat: false
    },
    [LevelObjectAnimation.SLASH_UP]: {
      name: LevelObjectAnimation.SLASH_UP,
      frames: [0x21, 0x22, 0x22, 0x23, 0x24],
      frameRate: 30,
      repeat: false
    },
    [LevelObjectAnimation.SLASH_DOWN]: {
      name: LevelObjectAnimation.SLASH_DOWN,
      frames: [0x29, 0x2a, 0x2a, 0x2b, 0x2c],
      frameRate: 30,
      repeat: false
    },
    [LevelObjectAnimation.HIT]: {
      name: LevelObjectAnimation.HIT,
      start: 0x30,
      end: 0x34,
      frameRate: 24,
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