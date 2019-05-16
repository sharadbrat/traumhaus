import Phaser from 'phaser';
import { SceneIdentifier, SceneManager, SceneObject } from './scenes/SceneManager';
import { GameSoundService } from '../service/GameSoundService';

export class Game extends Phaser.Game {

  private scenes: SceneObject[];

  constructor(canvas: HTMLCanvasElement) {
    const gameConfig = {
      type: Phaser.WEBGL,
      width: window.innerWidth,
      height: window.innerHeight,
      render: { pixelArt: true },
      canvas: canvas,
      autoFocus: true,
      physics: { default: "arcade", arcade: { debug: false, gravity: { y: 0 } } },
    };
    super(gameConfig);

    this.initializeSounds();
    this.initializeScenes();
  }

  private initializeScenes() {
    this.scenes = SceneManager.getScenes();
    this.scenes.forEach(el => this.scene.add(el.key, el.scene));
    this.scene.start(SceneIdentifier.PRELOADER_SCENE);
  }

  private initializeSounds() {
    const soundService = GameSoundService.getInstance();
    soundService.initialize(this);
    soundService.addSoundsToGame(this);
  }
}
