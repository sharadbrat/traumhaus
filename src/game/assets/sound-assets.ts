import { Asset } from './AssetManager';

export const DASH_SOUND_ASSET_ID = 'DASH_SOUND_ASSET';
export const MAIN_THEME_AUDIO_ID = 'MAIN_THEME_AUDIO';
export const FOREST_AMBIENT_AUDIO_ID = 'FOREST_AMBIENT_AUDIO';
export const CITY_AMBIENT_AUDIO_ID = 'CITY_AMBIENT_AUDIO';

export interface SoundAsset extends Asset {
  soundConfig?: SoundConfig;
}

export const mainThemeAudioAsset: SoundAsset = {
  name: MAIN_THEME_AUDIO_ID,
  file: '/sounds/main_theme.mp3',
};

export const dashSoundAsset: SoundAsset = {
  name: DASH_SOUND_ASSET_ID,
  file: '/sounds/dash.mp3',
  soundConfig: { loop: false, volume: 0.05 },
};

export const forestAmbientAudioAsset: SoundAsset = {
  name: FOREST_AMBIENT_AUDIO_ID,
  file: '/sounds/ambient_forest.mp3',
};

export const cityAmbientAudioAsset: SoundAsset = {
  name: CITY_AMBIENT_AUDIO_ID,
  file: '/sounds/ambient_city.mp3',
};