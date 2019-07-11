import { Asset } from './AssetManager';

export const MAIN_THEME_AUDIO_ID = 'MAIN_THEME_AUDIO';
export const GHOST_THEME_AUDIO_ID = 'GHOST_THEME_AUDIO';
export const CAVE_THEME_AUDIO_ID = 'CAVE_THEME_AUDIO';
export const CAVE_GHOST_THEME_AUDIO_ID = 'CAVE_GHOST_THEME_AUDIO';
export const PARK_THEME_AUDIO_ID = 'PARK_THEME_AUDIO';
export const PARK_GHOST_THEME_AUDIO_ID = 'PARK_GHOST_THEME_AUDIO';
export const BOSS_THEME_AUDIO_ID = 'BOSS_THEME_AUDIO';

export const DASH_SOUND_ASSET_ID = 'DASH_SOUND_ASSET';
export const SHOOT_SOUND_ASSET_ID = 'SHOOT_SOUND_ASSET';
export const HIT_SOUND_ASSET_ID = 'HIT_SOUND_ASSET';
export const GATE_SOUND_ASSET_ID = 'GATE_SOUND_ASSET';

export const FOOTSTEP_DIRT_SOUND_ASSET_ID = 'FOOTSTEP_DIRT_SOUND_ASSET';
export const FOOTSTEP_FLOOR_SOUND_ASSET_ID = 'FOOTSTEP_FLOOR_SOUND_ASSET';
export const FOOTSTEP_GHOST_SOUND_ASSET_ID = 'FOOTSTEP_GHOST_SOUND_ASSET';
export const FOOTSTEP_GRASS_SOUND_ASSET_ID = 'FOOTSTEP_GRASS_SOUND_ASSET';
export const FOOTSTEP_PLAIN_SOUND_ASSET_ID = 'FOOTSTEP_PLAIN_SOUND_ASSET';
export const FOOTSTEP_STONE_SOUND_ASSET_ID = 'FOOTSTEP_STONE_SOUND_ASSET';

export const FOREST_AMBIENT_AUDIO_ID = 'FOREST_AMBIENT_AUDIO';
export const CITY_AMBIENT_AUDIO_ID = 'CITY_AMBIENT_AUDIO';

export interface SoundAsset extends Asset {
  soundConfig?: SoundConfig;
}

// THEMES

export const mainThemeAudioAsset: SoundAsset = {
  name: MAIN_THEME_AUDIO_ID,
  file: '/sounds/theme_main.mp3',
  soundConfig: {
    loop: true,
  }
};

export const ghostThemeAudioAsset: SoundAsset = {
  name: GHOST_THEME_AUDIO_ID,
  file: '/sounds/theme_ghost.mp3',
  soundConfig: {
    loop: true,
  }
};

export const caveThemeAudioAsset: SoundAsset = {
  name: CAVE_THEME_AUDIO_ID,
  file: '/sounds/theme_cave.mp3',
  soundConfig: {
    volume: 0.2,
    loop: true,
  }
};

export const caveGhostThemeAudioAsset: SoundAsset = {
  name: CAVE_GHOST_THEME_AUDIO_ID,
  file: '/sounds/cave_theme_ghost.mp3',
  soundConfig: {
    volume: 0.2,
    loop: true,
  }
};

export const parkThemeAudioAsset: SoundAsset = {
  name: PARK_THEME_AUDIO_ID,
  file: '/sounds/theme_park_real.mp3',
  soundConfig: {
    volume: 0.3,
    loop: true,
  }
};

export const parkGhostThemeAudioAsset: SoundAsset = {
  name: PARK_GHOST_THEME_AUDIO_ID,
  file: '/sounds/theme_park_ghost.mp3',
  soundConfig: {
    volume: 0.3,
    loop: true,
  }
};

export const bossThemeAudioAsset: SoundAsset = {
  name: BOSS_THEME_AUDIO_ID,
  file: '/sounds/theme_boss.mp3',
  soundConfig: {
    volume: 0.3,
    loop: true,
  }
};

// SFX

export const dashSoundAsset: SoundAsset = {
  name: DASH_SOUND_ASSET_ID,
  file: '/sounds/dash.mp3',
  soundConfig: { loop: false, volume: 0.1 },
};

export const gateSoundAsset: SoundAsset = {
  name: GATE_SOUND_ASSET_ID,
  file: '/sounds/SFX_gate.mp3',
  soundConfig: { loop: false, volume: 0.5 },
};

export const shootSoundAsset: SoundAsset = {
  name: SHOOT_SOUND_ASSET_ID,
  file: '/sounds/SFX_shoot.mp3',
  soundConfig: { loop: false, volume: 0.8 },
};

export const hitSoundAsset: SoundAsset = {
  name: HIT_SOUND_ASSET_ID,
  file: '/sounds/SFX_hit.mp3',
  soundConfig: { loop: false, volume: 4 },
};

// FOOTSTEPS

export const footStepDirtSoundAsset: SoundAsset = {
  name: FOOTSTEP_DIRT_SOUND_ASSET_ID,
  file: '/sounds/FS_dirt.mp3',
  soundConfig: { loop: false, volume: 1 },
};

export const footStepFloorSoundAsset: SoundAsset = {
  name: FOOTSTEP_FLOOR_SOUND_ASSET_ID,
  file: '/sounds/FS_floor.mp3',
  soundConfig: { loop: false, volume: 1 },
};

export const footStepGhostSoundAsset: SoundAsset = {
  name: FOOTSTEP_GHOST_SOUND_ASSET_ID,
  file: '/sounds/FS_ghost.mp3',
  soundConfig: {
    loop: true,
    volume: 0.5,
    seek: 0,
    delay: 0
  },
};

export const footStepGrassSoundAsset: SoundAsset = {
  name: FOOTSTEP_GRASS_SOUND_ASSET_ID,
  file: '/sounds/FS_grass.mp3',
  soundConfig: { loop: false, volume: 1 },
};

export const footStepPlainSoundAsset: SoundAsset = {
  name: FOOTSTEP_PLAIN_SOUND_ASSET_ID,
  file: '/sounds/FS.mp3',
  soundConfig: {
    loop: true,
    volume: 3,
    seek: 0,
    delay: 0
  },
};
export const footStepStoneSoundAsset: SoundAsset = {
  name: FOOTSTEP_STONE_SOUND_ASSET_ID,
  file: '/sounds/FS_stone.mp3',
  soundConfig: { loop: false, volume: 1 },
};

// AMBIENT

export const forestAmbientAudioAsset: SoundAsset = {
  name: FOREST_AMBIENT_AUDIO_ID,
  file: '/sounds/ambient_forest.mp3',
  soundConfig: { loop: false, volume: 0.2 },
};

export const cityAmbientAudioAsset: SoundAsset = {
  name: CITY_AMBIENT_AUDIO_ID,
  file: '/sounds/ambient_city.mp3',
  soundConfig: { loop: false, volume: 0.3 },
};