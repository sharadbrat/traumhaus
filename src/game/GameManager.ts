import { SceneManager } from './scenes/SceneManager';
import { Game } from './Game';

export interface GameManagerOptions {
  canvas: HTMLCanvasElement;
  onGamePause: () => void;
}

export class GameManager {

  private game: Game;
  private gameConfig: GameConfig;
  private canvas: HTMLCanvasElement;

  constructor(options: GameManagerOptions) {
    this.canvas = options.canvas;
    window.addEventListener('resize', () => {
      // this.game.canvas.width = window.innerWidth;
      // this.game.canvas.height = window.innerHeight;
      // this.game.resize(window.innerWidth, window.innerHeight);
    });
  }

  public run() {
    this.game = new Game(this.canvas);
  }

  public loadProgress() {

  }

  public saveProgress() {

  }

  public pause() {
    SceneManager.getScenes().forEach(el => this.game.scene.pause(el.key));
  }

  public resume() {
    SceneManager.getScenes().forEach(el => this.game.scene.resume(el.key));
  }
}
