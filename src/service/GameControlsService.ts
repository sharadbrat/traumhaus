import Phaser from 'phaser';
import nipplejs from 'nipplejs';
import { GameProgressService } from './GameProgressService';

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

export interface JoystickKeys {
  horizontal: number;
  vertical: number;
  dash: boolean;
  interact: boolean;
  switch: boolean;
  shoot: boolean;
}


export class GameControlsService {
  private static instance: GameControlsService;

  private mode: ControlsType;

  public static readonly CONTROLS = ControlsType;
  private joystick: any;
  private joystickKeys: JoystickKeys;

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

  public getJoystick(joystickKeys: JoystickKeys) {
    this.joystickKeys = joystickKeys;

    if (!this.joystick) {
      this.joystick = nipplejs.create({
        zone: document.getElementById('joystick'),
        mode: 'static',
        position: {left: '50%', top: '50%'},
      });

      this.joystick.on('move', (evt:any, data: any) => {
        const force = Math.min(data.force, 1);
        // cos for horizontal
        this.joystickKeys.horizontal = Math.cos(data.angle.radian) * force;
        // sin for vertical
        this.joystickKeys.vertical = -Math.sin(data.angle.radian) * force;
      });

      this.joystick.on('end', () => {
        this.joystickKeys.horizontal = 0;
        this.joystickKeys.vertical = 0;
      });

      document.getElementById('button-dash').addEventListener('pointerdown', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.dash = true;
      });

      document.getElementById('button-dash').addEventListener('pointerleave', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.dash = false;
      });

      document.getElementById('button-interact').addEventListener('pointerdown', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.interact = true;
      });

      document.getElementById('button-interact').addEventListener('pointerleave', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.interact = false;
      });

      document.getElementById('button-switch').addEventListener('pointerdown', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.switch = true;
      });

      document.getElementById('button-switch').addEventListener('pointerleave', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.switch = false;
      });

      document.getElementById('button-shoot').addEventListener('pointerdown', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.shoot = true;
      });

      document.getElementById('button-shoot').addEventListener('pointerleave', (ev) => {
        if (!GameProgressService.getInstance().getProgress().isControllable) {
          return;
        }
        this.joystickKeys.shoot = false;
      });
    }
    return this.joystick;
  }

  public getGamepad() {
    // buttons:
    // B - 2
    // A - 1
    // Y - 3
    // X - 0
    return navigator.getGamepads()[0];
  }

  reset() {
    GameControlsService.instance = null;
  }
}