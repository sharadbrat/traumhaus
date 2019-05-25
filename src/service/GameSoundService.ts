import { AssetManager } from '../game';
import { SoundAsset } from '../game/assets';

interface SoundObject {
  sound: Phaser.Sound.WebAudioSound;
  id: string;
  asset: SoundAsset;
}

export class GameSoundService {
  private static instance: GameSoundService;
  private game: Phaser.Game;
  private sounds: SoundObject[];
  private themes: SoundObject[];
  private currentTheme: SoundObject;
  private currentAmbients: SoundObject[];

  private constructor() {
  }

  public static getInstance(): GameSoundService {
    if (!this.instance) {
      this.instance = new GameSoundService();
    }
    return this.instance;
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

  public setTheme(id: string | null) {
    const soundObject = this.themes.find(el => el.id === id);
    if (!soundObject) {
      throw new ReferenceError(`Theme with id "${id}" is not registered`);
    }

    if (id) {
      if (this.currentTheme) {
        if (this.currentTheme.id !== id) {
          this.currentTheme.sound.setVolume(0);

          this.currentTheme = soundObject;

          this.currentTheme.sound.setVolume(1);
          if (!this.currentTheme.sound.isPlaying) {
            this.currentTheme.sound.play(undefined, { loop: true });
          }
        }
      } else {
        this.currentTheme = soundObject;
        this.currentTheme.sound.setVolume(1);
        if (!this.currentTheme.sound.isPlaying) {
          this.currentTheme.sound.play(undefined, { loop: true });
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
}
