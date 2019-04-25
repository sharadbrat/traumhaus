import { SceneManager } from './scenes/SceneManager';
import { Game } from './Game';

export class GameManager {

  private game: Game;
  private sceneManager: SceneManager;
  private gameConfig: GameConfig;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
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

  }

  public resume() {

  }
}
