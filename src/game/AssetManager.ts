export const ENVIRONMENT_GRAPHICAL_ASSET_ID = 'ENVIRONMENT_GRAPHICAL_ASSET';
export const PLAYER_GRAPHICAL_ASSET_ID = 'PLAYER_GRAPHICAL_ASSET';
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

export interface SpriteAsset extends GraphicalAsset {
  animations: {
    [id:string]: Animation;
  };
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
  file: '/tiles/RogueEnvironment.png',
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

const playerGraphicalAsset: SpriteAsset = {
  name: PLAYER_GRAPHICAL_ASSET_ID,
  width: 32,
  height: 32,
  file: '/tiles/Player.png',
  animations: {
    idle: {
      name: 'playerIdle',
      start: 0x01,
      end: 0x07,
      frameRate: 6,
      repeat: true
    },
    walk: {
      name: 'playerWalk',
      start: 0x08,
      end: 0x0d,
      frameRate: 10,
      repeat: true
    },
    walkBack: {
      name: 'playerWalkBack',
      start: 0x10,
      end: 0x15,
      frameRate: 10,
      repeat: true
    },
    // Ideally attacks should be five frames at 30fps to
    // align with the attack duration of 165ms
    slash: {
      name: 'playerSlash',
      frames: [0x18, 0x19, 0x19, 0x1a, 0x1b],
      frameRate: 30,
      repeat: false
    },
    slashUp: {
      name: 'playerSlashUp',
      frames: [0x21, 0x22, 0x22, 0x23, 0x24],
      frameRate: 30,
      repeat: false
    },
    slashDown: {
      name: 'playerSlashDown',
      frames: [0x29, 0x2a, 0x2a, 0x2b, 0x2c],
      frameRate: 30,
      repeat: false
    },
    hit: {
      name: 'playerHit',
      start: 0x30,
      end: 0x34,
      frameRate: 24,
      repeat: false
    },
    death: {
      name: 'playerDeath',
      start: 0x38,
      end: 0x3d,
      frameRate: 24,
      repeat: false
    }
  }
};

const ghostPlayerGraphicalAsset: SpriteAsset = {
  name: GHOST_PLAYER_GRAPHICAL_ASSET_ID,
  width: 32,
  height: 32,
  file: '/tiles/GhostPlayer.png',
  animations: {
    idle: {
      name: 'playerIdle',
      start: 0x01,
      end: 0x07,
      frameRate: 6,
      repeat: true
    },
    walk: {
      name: 'playerWalk',
      start: 0x08,
      end: 0x0d,
      frameRate: 10,
      repeat: true
    },
    walkBack: {
      name: 'playerWalkBack',
      start: 0x10,
      end: 0x15,
      frameRate: 10,
      repeat: true
    },
    // Ideally attacks should be five frames at 30fps to
    // align with the attack duration of 165ms
    slash: {
      name: 'playerSlash',
      frames: [0x18, 0x19, 0x19, 0x1a, 0x1b],
      frameRate: 30,
      repeat: false
    },
    slashUp: {
      name: 'playerSlashUp',
      frames: [0x21, 0x22, 0x22, 0x23, 0x24],
      frameRate: 30,
      repeat: false
    },
    slashDown: {
      name: 'playerSlashDown',
      frames: [0x29, 0x2a, 0x2a, 0x2b, 0x2c],
      frameRate: 30,
      repeat: false
    },
    hit: {
      name: 'playerHit',
      start: 0x30,
      end: 0x34,
      frameRate: 24,
      repeat: false
    },
    death: {
      name: 'playerDeath',
      start: 0x38,
      end: 0x3d,
      frameRate: 24,
      repeat: false
    }
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
  ];

  public static readonly sprites: SpriteAsset[] = [
    playerGraphicalAsset,
    ghostPlayerGraphicalAsset,
  ];

  public static readonly sounds: SoundAsset[] = [
    dashSoundAsset,
    mainThemeAudioAsset
  ];

  public static readonly graphicalAssets: { [id: string]: GraphicalAsset } = {
    environment: environmentGraphicalAsset,
    util: utilGraphicalAsset,
  };

  public static readonly spriteAssets: { [id: string]: SpriteAsset } = {
    player: playerGraphicalAsset,
    ghostPlayer: ghostPlayerGraphicalAsset,
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

    AssetManager.sprites.forEach(el => scene.load.spritesheet(el.name, el.file, {
      frameHeight: el.height,
      frameWidth: el.width
    }));

    AssetManager.sounds.forEach(el => scene.load.audio(el.name, el.file));
  }

  public static getSpriteAssetByKey(key: string): SpriteAsset {
    return this.sprites.find(el => el.name === key);
  }
}
