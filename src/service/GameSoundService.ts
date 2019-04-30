import { AssetManager, SoundAsset } from '../game';

interface SoundObject {
  sound: Phaser.Sound.BaseSound;
  id: string;
  asset: SoundAsset;
}

export class GameSoundService {
  private static instance: GameSoundService;
  private game: Phaser.Game;
  private sounds: SoundObject[];

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
        sound: game.sound.add(el.name, el.soundConfig),
        asset: el,
      };
    });
  }

  public playSound(id: string, config?: SoundConfig) {

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
