import Phaser from 'phaser';

export enum ControlsType {
  KEYBOARD = 'KEYBOARD',
  ON_SCREEN = 'ON_SCREEN',
  GAMEPAD = 'GAMEPAD',
}

export interface Keys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  dash: Phaser.Input.Keyboard.Key;
  interact: Phaser.Input.Keyboard.Key;
  shoot: Phaser.Input.Keyboard.Key;
  ghost: Phaser.Input.Keyboard.Key;
}

export interface KeyControls {
  up: Phaser.Input.Keyboard.KeyCodes;
  down: Phaser.Input.Keyboard.KeyCodes;
  left: Phaser.Input.Keyboard.KeyCodes;
  right: Phaser.Input.Keyboard.KeyCodes;
  dash: Phaser.Input.Keyboard.KeyCodes;
  interact: Phaser.Input.Keyboard.KeyCodes;
  shoot: Phaser.Input.Keyboard.KeyCodes;
  ghost: Phaser.Input.Keyboard.KeyCodes;
}


export class GameControlsService {
  private static instance: GameControlsService;

  private mode: ControlsType;

  public static readonly CONTROLS = ControlsType;

  private constructor() {
  }

  public static getInstance(): GameControlsService {
    if (!GameControlsService.instance) {
      GameControlsService.instance = new GameControlsService();
    }
    return GameControlsService.instance
  }

  public setMode(mode: ControlsType) {
    this.mode = mode;
  }

  public getMode(): ControlsType {
    return this.mode;
  }

  public getKeyboardControls(): KeyControls {
    return {
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      dash: Phaser.Input.Keyboard.KeyCodes.SPACE,
      ghost: Phaser.Input.Keyboard.KeyCodes.Q,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      shoot: Phaser.Input.Keyboard.KeyCodes.W,
    };
  }

  public getGamepadControls(): KeyControls {
    return {
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      dash: Phaser.Input.Keyboard.KeyCodes.SPACE,
      ghost: Phaser.Input.Keyboard.KeyCodes.Q,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      shoot: Phaser.Input.Keyboard.KeyCodes.W,
    };
  }

  public getTouchControls(): KeyControls {
    return {
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      dash: Phaser.Input.Keyboard.KeyCodes.SPACE,
      ghost: Phaser.Input.Keyboard.KeyCodes.Q,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      shoot: Phaser.Input.Keyboard.KeyCodes.W,
    };
  }

}