import Phaser from 'phaser';
import { SceneIdentifier, SceneManager, SceneObject } from './scenes/SceneManager';

export class Game extends Phaser.Game {

  private scenes: SceneObject[];

  constructor(canvas: HTMLCanvasElement) {
    const gameConfig = {
      type: Phaser.WEBGL,
      width: window.innerWidth,
      height: window.innerHeight,
      render: {pixelArt: true},
      canvas: canvas,
      autoFocus: true,
      physics: {
        default: 'arcade',
        arcade: {
          debug: process.env.NODE_ENV === 'development',
          gravity: {y: 0}
        }
      },
      input: {
        gamepad: true,
        keyboard: true,
      }
    };
    super(gameConfig);

    this.initializeScenes();
  }

  private initializeScenes() {
    this.scenes = SceneManager.getScenes();
    this.scenes.forEach(el => this.scene.add(el.key, el.scene));
    this.scene.start(SceneIdentifier.PRELOADER_SCENE);
  }
}
