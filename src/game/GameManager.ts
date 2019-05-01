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


  // todo: add impl of running a game from data, which is basically a loading of progress feature
  public run(data?: any) {
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
