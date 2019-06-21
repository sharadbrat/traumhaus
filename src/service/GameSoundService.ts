import { AssetManager } from '../game';
import { footStepGhostSoundAsset, footStepPlainSoundAsset, SoundAsset } from '../game/assets';
import { GameScene } from '../game/scenes/GameScene';
import { GameGhostService } from './GameGhostService';

export interface SoundObject {
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
  private currentAmbients: SoundObject[] = [];

  private ambients: SoundObject[];
  private footstep: Phaser.Sound.WebAudioSound;
  private ghostFootstep: Phaser.Sound.WebAudioSound;

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
    });

    this.footstep = this.game.sound.add(footStepPlainSoundAsset.name, footStepPlainSoundAsset.soundConfig) as Phaser.Sound.WebAudioSound
    this.ghostFootstep = this.game.sound.add(footStepGhostSoundAsset.name, footStepGhostSoundAsset.soundConfig) as Phaser.Sound.WebAudioSound
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

          const prevSound = this.currentTheme.sound;
          const currSound = soundObject.sound;

          setTimeout(() => {
            prevSound.setVolume(0);
            currSound.setVolume(desiredVolume);
          }, GameSoundService.THEME_FADE_TIME);

          this.currentTheme = soundObject;

          if (!this.currentTheme.sound.isPlaying) {
            this.currentTheme.sound.play();
          }

          this.fadeSound(soundObject.sound, scene, desiredVolume);
        }
      } else {
        this.currentTheme = soundObject;
        // this.currentTheme.sound.setVolume(desiredVolume);

        if (!this.currentTheme.sound.isPlaying) {
          this.currentTheme.sound.play();
        }
        this.fadeSound(soundObject.sound, scene, desiredVolume);
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
      targets: sound,
      volume: volume,
      ease: 'Linear',
      duration: GameSoundService.THEME_FADE_TIME,
    });
  }

  public setAmbients(ambients: string[], scene: GameScene) {
    this.currentAmbients.forEach(el => {
      this.fadeSound(el.sound, scene, 0);
      setTimeout(() => el.sound.setVolume(0), GameSoundService.THEME_FADE_TIME);
    });

    if (ambients && ambients.length > 0) {
      this.currentAmbients = ambients.map(id => this.themes.find(elem => elem.id === id));
      this.currentAmbients.forEach(el => {
        this.fadeSound(el.sound, scene, 1);
        if (!el.sound.isPlaying) {
          el.sound.play();
        }
      });
    }
  }

  public setFootstepPlay(flag: boolean) {
    const ghost = GameGhostService.getInstance().isGhostMode();
    if (ghost) {
      this.footstep.setVolume(0);

      if (flag && !this.ghostFootstep.isPlaying) {
        this.ghostFootstep.play();
      }
      this.ghostFootstep.setVolume(flag ? footStepGhostSoundAsset.soundConfig.volume : 0);
    } else {
      this.ghostFootstep.setVolume(0);

      if (flag && !this.footstep.isPlaying) {
        this.footstep.play();
      }
      this.footstep.setVolume(flag ? footStepPlainSoundAsset.soundConfig.volume : 0);
    }
  }

  public stopFootstep() {
    this.footstep.setVolume(0);
    this.ghostFootstep.setVolume(0);
  }
}
