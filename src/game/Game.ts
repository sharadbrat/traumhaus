import Phaser from 'phaser';
import { SceneIdentifier, SceneManager, SceneObject } from './scenes/SceneManager';

export class Game extends Phaser.Game {

  private scenes: SceneObject[];

  constructor(canvas: HTMLCanvasElement) {
    const gameConfig: GameConfig = {
      type: Phaser.WEBGL,
      width: window.innerWidth,
      height: window.innerHeight,
      render: { pixelArt: true },
      canvas: canvas,
      physics: { default: "arcade", arcade: { debug: false, gravity: { y: 0 } } },
    };
    super(gameConfig);

    this.scenes = SceneManager.getScenes();

    this.scenes.forEach(el => this.scene.add(el.key, el.scene));

    this.scene.start(SceneIdentifier.PRELOADER_SCENE);
  }
}
