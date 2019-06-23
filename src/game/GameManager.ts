import { SceneIdentifier, SceneManager } from './scenes/SceneManager';
import { Game } from './Game';
import { GameScene } from './scenes/GameScene';
import { ControlsType, GameControlsService } from '../service/GameControlsService';
import { GameGhostService, GameMenuService, GameProgressService, GameSoundService } from '../service';

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
    GameProgressService.getInstance().saveProgressToLocalStorage();
  }

  public pause() {
    const scene = this.game.scene.getScene(SceneIdentifier.GAME_SCENE) as GameScene;
    if (GameControlsService.getInstance().getMode() === ControlsType.ON_SCREEN) {
      const joystickKeys = scene.getPlayer().getJoystickKeys();
      joystickKeys.interact = false;
      joystickKeys.switch = false;
      joystickKeys.dash = false;
      joystickKeys.shoot = false;
      joystickKeys.vertical = 0;
      joystickKeys.horizontal = 0;
    } else if (GameControlsService.getInstance().getMode() === ControlsType.GAMEPAD) {
      // actually, dont need to do anything
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

  public shutdown() {
    this.game.destroy(false);
    GameProgressService.getInstance().reset();
    GameGhostService.getInstance().reset();
    GameSoundService.getInstance().reset();
    GameMenuService.getInstance().reset();
    GameControlsService.getInstance().reset();
  }

  public restartFromCheckpoint() {
    // todo: add impl
  }
}
