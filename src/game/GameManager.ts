import { SceneIdentifier, SceneManager, SceneObject } from './scenes/SceneManager';
import { Game } from './Game';
import { GameScene } from './scenes/GameScene';

export interface GameManagerOptions {
  canvas: HTMLCanvasElement;
}

export class GameManager {

  private game: Game;
  private gameConfig: GameConfig;
  private canvas: HTMLCanvasElement;

  constructor(options: GameManagerOptions) {
    this.canvas = options.canvas;
  }

  public getGame(): Game {
    return this.game;
  }

  public run() {
    this.game = new Game(this.canvas);
  }

  public loadProgress() {

  }

  public saveProgress() {

  }

  public pause() {
    // todo: add controller class which would manage this
    const keys = (this.game.scene.getScene(SceneIdentifier.GAME_SCENE) as GameScene).getPlayer().getKeys();
    Object.values(keys).forEach(el => el.isDown = false);
    SceneManager.getScenes().forEach(el => this.game.scene.pause(el.key));
  }

  public resume() {
    this.game.input.keyboard.enabled = true;
    SceneManager.getScenes().forEach(el => this.game.scene.resume(el.key));
  }
}
