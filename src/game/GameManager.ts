import { SceneIdentifier, SceneManager } from './scenes/SceneManager';
import { Game } from './Game';
import { GameScene } from './scenes/GameScene';
import { ControlsType, GameControlsService } from '../service/GameControlsService';

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
    const scene = this.game.scene.getScene(SceneIdentifier.GAME_SCENE) as GameScene;
    if (GameControlsService.getInstance().getMode() === ControlsType.ON_SCREEN) {
      const joystickKeys = scene.getPlayer().getJoystickKeys();
      joystickKeys.interact = false;
      joystickKeys.switch = false;
      joystickKeys.dash = false;
      joystickKeys.shoot = false;
      joystickKeys.vertical = 0;
      joystickKeys.horizontal = 0;
    } else {
      const keys = scene.getPlayer().getKeys();
      Object.values(keys).forEach(el => el.isDown = false);
    }
    SceneManager.getScenes().forEach(el => this.game.scene.pause(el.key));
  }

  public resume() {
    this.game.input.keyboard.enabled = true;
    SceneManager.getScenes().forEach(el => this.game.scene.resume(el.key));
  }
}
