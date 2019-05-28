import { AssetManager } from '../game';
import { SoundAsset } from '../game/assets';

interface SoundObject {
  sound: Phaser.Sound.WebAudioSound;
  id: string;
  asset: SoundAsset;
}

export class GameSoundService {
  private static readonly THEME_FADE_TIME = 400;

  private static instance: GameSoundService;
  private game: Phaser.Game;
  private sounds: SoundObject[];
  private themes: SoundObject[];
  private currentTheme: SoundObject;
  private currentAmbients: SoundObject[];

  private constructor() {
  }

  public static getInstance(): GameSoundService {
    if (!GameSoundService.instance) {
      GameSoundService.instance = new GameSoundService();
    }
    return GameSoundService.instance;
  }

  // should be called in game constructor
  public initialize(game: Phaser.Game) {
    this.game = game;
  }

  public addSoundsToGame(game: Phaser.Game) {
    if (!this.game) {
      throw new ReferenceError('GameSoundService is not initialized!');
    }

    this.sounds = AssetManager.sounds.map(el => {
      return {
        id: el.name,
        sound: this.game.sound.add(el.name, el.soundConfig) as Phaser.Sound.WebAudioSound,
        asset: el,
      };
    });

    this.themes = AssetManager.musicThemes.map(el => {
      return {
        id: el.name,
        sound: this.game.sound.add(el.name, el.soundConfig) as Phaser.Sound.WebAudioSound,
        asset: el,
      };
    })
  }

  public setTheme(id: string | null, scene: Phaser.Scene) {
    const soundObject = this.themes.find(el => el.id === id);
    if (!soundObject) {
      throw new ReferenceError(`Theme with id "${id}" is not registered`);
    }

    if (id) {
      const desiredVolume = soundObject.asset.soundConfig && soundObject.asset.soundConfig.volume ? soundObject.asset.soundConfig.volume : 1;

      if (this.currentTheme) {
        if (this.currentTheme.id !== id) {
          // this.currentTheme.sound.setVolume(0);
          this.fadeSound(this.currentTheme.sound, scene, 0);

          this.currentTheme = soundObject;

          this.fadeSound(soundObject.sound, scene, desiredVolume);
          if (!this.currentTheme.sound.isPlaying) {
            this.currentTheme.sound.play(undefined, {loop: true});
          }
        }
      } else {
        this.currentTheme = soundObject;
        // this.currentTheme.sound.setVolume(desiredVolume);
        this.fadeSound(soundObject.sound, scene, desiredVolume);
        if (!this.currentTheme.sound.isPlaying) {
          this.currentTheme.sound.play(undefined, {loop: true});
        }
      }
    } else {
      this.currentTheme.sound.setVolume(0);
      this.currentTheme = null;
    }
  }

  public playSfx(id: string, config?: SoundConfig) {

    if (!this.game) {
      throw new ReferenceError('GameSoundService is not initialized!');
    }

    const soundObject = this.sounds.find(el => el.id === id);
    if (!soundObject) {
      throw new ReferenceError(`Sound with id "${id}" is not registered`);
    }

    this.game.sound.play(id, config || soundObject.asset.soundConfig);
  }

  public pauseSound(id: string) {
    if (!this.game) {
      throw new ReferenceError('GameSoundService is not initialized!');
    }

    // todo: add implementation

  }

  private fadeSound(sound: Phaser.Sound.WebAudioSound, scene: Phaser.Scene, volume: number) {
    scene.tweens.add({
      targets: this.currentTheme.sound,
      volume: volume,
      ease: 'Linear',
      duration: GameSoundService.THEME_FADE_TIME,
    });
  }
}
