import { LevelObjectAnimation } from './entities/LevelMap';
import { GameScene } from './scenes/GameScene';

export const ENVIRONMENT_GRAPHICAL_ASSET_ID = 'ENVIRONMENT_GRAPHICAL_ASSET';
export const GHOST_ENVIRONMENT_GRAPHICAL_ASSET_ID = 'GHOST_ENVIRONMENT_GRAPHICAL_ASSET';
export const PLAYER_GRAPHICAL_ASSET_ID = 'PLAYER_GRAPHICAL_ASSET';
export const PROFESSOR_GRAPHICAL_ASSET_ID = 'PROFESSOR';
export const GHOST_PLAYER_GRAPHICAL_ASSET_ID = 'GHOST_PLAYER_GRAPHICAL_ASSET';
export const ITEMS_GRAPHICAL_ASSET_ID = 'ITEMS_GRAPHICAL_ASSET';
export const UTIL_GRAPHICAL_ASSET_ID = 'UTIL_GRAPHICAL_ASSET';

export const DASH_SOUND_ASSET_ID = 'DASH_SOUND_ASSET';

export const MAIN_THEME_AUDIO_ID = 'MAIN_THEME_AUDIO';

export type Animation = Phaser.Animations.Types.GenerateFrameNumbers & {name: string, frameRate: number, repeat: boolean};

export interface Asset {
  name: string;
  file: string;
}

export interface SoundAsset extends Asset {
  soundConfig?: SoundConfig;
}

export interface GraphicalAsset extends Asset {
  name: string;
  width: number;
  height: number;
  file: string;
  indices?: any;
}

export type AnimationMap = {
  [id in LevelObjectAnimation]: Animation;
};

export interface SpriteAsset extends GraphicalAsset {
  animations: AnimationMap;
}

const mainThemeAudioAsset: SoundAsset = {
  name: MAIN_THEME_AUDIO_ID,
  file: '/sounds/main_theme.mp3',
};

const dashSoundAsset: SoundAsset = {
  name: DASH_SOUND_ASSET_ID,
  file: '/sounds/dash.mp3',
  soundConfig: { loop: false, volume: 0.05 },
};

const environmentGraphicalAsset: GraphicalAsset = {
  name: ENVIRONMENT_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/Stage1_Tiles.png',
  indices: {
    floor: {
      outer: [0x05, 0x05, 0x05, 0x15, 0x07, 0x17]
    },
    block: 0x17,
    walls: {
      alone: 0x14,
      intersections: {
        e_s: 0x00,
        n_e_s_w: 0x01,
        e_w: 0x02,
        s_w: 0x03,
        n_e_s: 0x10,
        w: 0x11,
        e: 0x12,
        n_s_w: 0x13,
        n_s: 0x20,
        s: 0x21,
        e_s_w: 0x22,
        n_e: 0x30,
        n_e_w: 0x31,
        n: 0x32,
        n_w: 0x33
      }
    },
    transparent: 0x88,
  }
};

const ghostEnvironmentGraphicalAsset: GraphicalAsset = {
  name: GHOST_ENVIRONMENT_GRAPHICAL_ASSET_ID,
  width: 16,
  height: 16,
  file: '/tiles/Stage1_Tiles_Ghostworld.png',
};

const playerGraphicalAsset: SpriteAsset = {
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

const professor: SpriteAsset = {
  name: PROFESSOR_GRAPHICAL_ASSET_ID,
  width: 32,
  height: 32,
  file: '/tiles/NPC_Prof.png',
// @ts-ignore
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

const ghostPlayerGraphicalAsset: SpriteAsset = {
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

export class AssetManager {
  public static readonly tiles: GraphicalAsset[] = [
    environmentGraphicalAsset,
    utilGraphicalAsset,
    ghostEnvironmentGraphicalAsset
  ];

  public static readonly sprites: SpriteAsset[] = [
    playerGraphicalAsset,
    ghostPlayerGraphicalAsset,
    professor
  ];

  public static readonly sounds: SoundAsset[] = [
    dashSoundAsset,
    mainThemeAudioAsset
  ];

  public static readonly graphicalAssets: { [id: string]: GraphicalAsset } = {
    environment: environmentGraphicalAsset,
    util: utilGraphicalAsset,
    ghost: ghostEnvironmentGraphicalAsset
  };

  public static readonly spriteAssets: { [id: string]: SpriteAsset } = {
    player: playerGraphicalAsset,
    ghostPlayer: ghostPlayerGraphicalAsset,
    professor
  };

  public static readonly soundAssets: { [id: string]: SoundAsset } = {
    dash: dashSoundAsset,
    main: mainThemeAudioAsset,
  };

  public static readonly environment: GraphicalAsset = environmentGraphicalAsset;
  public static readonly util: GraphicalAsset = utilGraphicalAsset;

  public static readonly player: SpriteAsset = playerGraphicalAsset;

  private game: Phaser.Game;

  constructor(game: Phaser.Game) {
    this.game = game
  }

  public static loadAssets(scene: Phaser.Scene) {
    AssetManager.tiles.forEach(el => scene.load.image(el.name, el.file));

    AssetManager.sprites.forEach(el => AssetManager.loadSprite(scene, el));

    AssetManager.sounds.forEach(el => scene.load.audio(el.name, el.file));
  }

  public static getSpriteAssetByKey(key: string): SpriteAsset {
    return this.sprites.find(el => el.name === key);
  }

  public static loadAnimations(scene: Phaser.Scene) {
    AssetManager.sprites.forEach(el => AssetManager.loadSpriteAnimations(scene, el));
  }

  private static loadSprite(scene: Phaser.Scene, sprite: SpriteAsset) {
    scene.load.spritesheet(sprite.name, sprite.file, {
      frameHeight: sprite.height,
      frameWidth: sprite.width
    });
  }

  private static loadSpriteAnimations(scene: Phaser.Scene, sprite: SpriteAsset) {
    Object.values(sprite.animations).forEach((anim: Animation) => {
      const key = `${sprite.name}__${anim.name}`;
      if (!scene.anims.get(key)) {
        scene.anims.create({
          key: key,
          frames: scene.anims.generateFrameNumbers(sprite.name, anim),
          frameRate: anim.frameRate,
          repeat: anim.repeat ? -1 : 0
        });
      }
    });
  }
}
