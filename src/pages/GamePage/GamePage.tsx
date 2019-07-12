import * as React from 'react';

import { AssetManager, GameManager, GameManagerOptions } from '../../game';
import { GameGhostService, GameMenuService, GameProgressService, GameSoundService } from '../../service';
import { TriggerContents, TriggerManager } from '../../game/TriggerManager';
import { DialogManager, GameDialog, GameDialogStep } from '../../game/dialogs';
import { Cooldowns, DeathMenu, Dialog, Menu, SettingsMenu, VirtualControls } from '../../components';
import { SceneIdentifier, SceneManager } from '../../game/scenes/SceneManager';
import { LevelManager } from '../../game/levels';
import { GameScene } from '../../game/scenes/GameScene';
import { Load } from '../../components/Load';
import { ControlsType, GameControlsService } from '../../service/GameControlsService';

import './_GamePage.scss';
import { FinishMenu } from '../../components/FinishMenu';

interface GamePageProps {
  history: History;
}

interface GamePageState {
  pause: boolean;
  dialogStep: GameDialogStep | undefined;
  isDialogActive: boolean;
  loadingProgress: number;
  virtualJoystickEnabled: boolean;
  health: number;
  showHud: boolean;
  isSettingsActive: boolean;
  isDeathMenuActive: boolean;
  isFinished: boolean;
}

const ACTION_BUTTON_CODE = ' ';

export class GamePage extends React.Component<any, GamePageState> {

  private readonly GAME_CANVAS_ID = 'game__canvas';

  private gameManager: GameManager;
  private canvasRef: React.Ref<HTMLCanvasElement>;
  private gamepadInterval: number;

  state: GamePageState = {
    pause: false,
    isDialogActive: false,
    dialogStep: undefined,
    loadingProgress: 0,
    virtualJoystickEnabled: false,
    health: 3,
    showHud: false,
    isSettingsActive: false,
    isDeathMenuActive: false,
    isFinished: false,
  };

  private reqId: number;
  private pauseLock: boolean;

  constructor(props: GamePageProps) {
    super(props);

    DialogManager.initialize(this.onDialogStart);
  }

  componentDidMount(): void {
    GameProgressService.getInstance().setOnHealthChange(this.onHealthChange);
    GameProgressService.getInstance().setOnGameFinish(this.onGameFinish);
    GameGhostService.getInstance().setOnGhostHud(this.onGhostHud);

    if (navigator.getGamepads()[0]) {
      this.gamepadTick()
    } else {
      window.addEventListener("gamepadconnected", this.gamepadListener);
    }

    if (!GameControlsService.getInstance().getMode()) {
      this.props.history.push('/');
      return;
    } else {
      const canvas: HTMLCanvasElement = document.getElementById(this.GAME_CANVAS_ID) as HTMLCanvasElement;

      const options: GameManagerOptions = {canvas};

      this.gameManager = new GameManager(options);
      this.gameManager.run();

      GameMenuService.getInstance().setOnMenuToggleListener(() => this.onMenuToggle());
      GameMenuService.getInstance().setOnUpdateLoadingListener((val: number) => this.onLoadingProgressUpdate(val));

      document.addEventListener('backbutton', (evt: any) => {
        evt.preventDefault();
        evt.stopPropagation();
        GameMenuService.getInstance().triggerOnMenuToggle();
      });

      window.addEventListener("hashchange", (e) => {
        if(e.oldURL.length > e.newURL.length) {
          this.gameManager.saveProgress();
          this.gameManager.shutdown();
        }
      });
    }
  }

  onMenuToggle = () => {
    this.gameManager.pause();
    this.setState({pause: true});
  };

  private onLoadingProgressUpdate(val: number) {
    this.setState({loadingProgress: val});
  }

  onMenuContinueClick = () => {
    this.gameManager.resume();
    this.setState({pause: false});
  };

  onMenuSettingsClick = () => {
    this.setState({isSettingsActive: true});
  };

  onMenuExitClick = () => {
    this.props.history.push('/');
    this.gameManager.saveProgress();
    this.gameManager.shutdown();
    this.setState({pause: false});
  };

  onDialogStart = (dialog: GameDialog) => {
    GameSoundService.getInstance().stopFootstep();

    const dialogStep = (step: number, listener: (evt: any) => void) => {
      if (dialog.steps[step]) {
        this.setState({dialogStep: dialog.steps[step]});
      } else {
        this.gameManager.resume();
        window.removeEventListener('keydown', listener);
        window.removeEventListener('pointerdown', listener);
        clearInterval(this.gamepadInterval);
        this.setState({dialogStep: null, isDialogActive: false});
        if (dialog.onDialogFinishedTrigger) {
          TriggerManager.fire(dialog.onDialogFinishedTrigger, this.getTriggerContentObject());
        }
      }
    };

    if (!this.state.isDialogActive) {
      this.gameManager.pause();

      let currentStep = 0;

      this.setState({isDialogActive: true, dialogStep: dialog.steps[currentStep]});

      if (GameControlsService.getInstance().getMode() === ControlsType.ON_SCREEN) {
        const clickListener = (event: PointerEvent) => {
          event.stopPropagation();
          currentStep++;
          dialogStep(currentStep, clickListener);
        };
        window.addEventListener('pointerdown', clickListener, false);
      } else if (GameControlsService.getInstance().getMode() === ControlsType.GAMEPAD) {
        const clickListener = () => {
          currentStep++;
          dialogStep(currentStep, clickListener);
        };
        let wasPressed = true;
        // @ts-ignore
        this.gamepadInterval = setInterval(() => {
          const pad = GameControlsService.getInstance().getGamepad();
          if (!wasPressed && pad && pad.buttons[2].pressed) {
            clickListener();
            wasPressed = true;
          } else if (wasPressed && pad && !pad.buttons[2].pressed) {
            wasPressed = false;
          }
        }, 20);
      } else {
        const keydownListener = (event: KeyboardEvent) => {
          event.stopPropagation();

          if (event.key === ACTION_BUTTON_CODE) {
            currentStep++;
            dialogStep(currentStep, keydownListener);
          }
        };
        window.addEventListener('keydown', keydownListener, false);
      }
    }
  };

  render() {
    if (this.state.isFinished) {
      return <FinishMenu isActive={true} onClose={this.onGameFinishClose} history={this.props.history}/>;
    }

    let hudAddition;
    if (this.state.virtualJoystickEnabled) {
      hudAddition = <VirtualControls/>;
    } else {
      hudAddition = <Cooldowns/>;
    }

    const HUD = (
      <div className="game__hud-container">
        <div className={ this.state.showHud ? 'game__hud-hearts game__hud-hearts_enabled' : 'game__hud-hearts'} id="hearts">
          <div className={`game__hud-heart ${this.state.health < 1 ? 'game__hud-heart_damaged' : ''}`}/>
          <div className={`game__hud-heart ${this.state.health < 2 ? 'game__hud-heart_damaged' : ''}`}/>
          <div className={`game__hud-heart ${this.state.health < 3 ? 'game__hud-heart_damaged' : ''}`}/>
        </div>
      </div>
    );

    return (
      <section className="game">
        <Load progress={this.state.loadingProgress}/>
        <div className="game__container">
          <canvas ref={this.canvasRef} id={this.GAME_CANVAS_ID} className="game__canvas"/>
          {hudAddition}
          {HUD}
          <Dialog step={this.state.dialogStep} isActive={this.state.isDialogActive}/>
          <Menu heading="Pause" isActive={this.state.pause}>
            <br/>
            <br/>
            <br/>
            <p className="pause__paragraph">Press START to continue playing</p>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <p className="pause__paragraph">Press SELECT to go to main menu.</p>
            <p className="pause__paragraph">Careful, the progress will not be saved!</p>
          </Menu>
          <SettingsMenu isActive={this.state.isSettingsActive} onClose={this.onMenuSettingsClose}/>
          <DeathMenu show={this.state.isDeathMenuActive}/>
        </div>
      </section>
    );
  }

  private onHealthChange = (health: number) => {
    if (health) {
      this.setState({health: health});
    } else {
      this.gameManager.pause();
      GameSoundService.getInstance().stopTheme();
      GameSoundService.getInstance().stopFootstep();
      this.setState({isDeathMenuActive: true});
    }
  };

  private onGhostHud = (isGhost: boolean) => {
    this.setState({showHud: isGhost && GameProgressService.getInstance().getProgress().showGhostHud});
  };

  private getTriggerContentObject(): TriggerContents {
    const game = this.gameManager.getGame();
    const scene = game.scene.getScene(SceneIdentifier.GAME_SCENE) as GameScene;
    return {
      scene: scene,
      player: scene.getPlayer(),
      services: {
        progress: GameProgressService.getInstance(),
        ghost: GameGhostService.getInstance(),
        sound: GameSoundService.getInstance(),
        menu: GameMenuService.getInstance(),
        controls: GameControlsService.getInstance(),
      },
      managers: {
        dialog: DialogManager,
        trigger: TriggerManager,
        game: GameManager,
        asset: AssetManager,
        scene: SceneManager,
        level: LevelManager,
      }
    }
  }

  private onMenuSettingsClose = () => {
    this.setState({isSettingsActive: false});
  };

  private onDeathMenuMainMenuClick = () => {
    this.setState({isDeathMenuActive: false});
    this.onMenuExitClick();
  };

  private onDeathMenuCheckpointClick = () => {
    this.gameManager.restartFromCheckpoint();
    this.setState({isDeathMenuActive: false});
  };

  private onGameFinish = () => {
    this.setState({isFinished: true});
  };

  private onGameFinishClose = () => {
    GameProgressService.getInstance().clearProgressInLocalStorage();
    this.gameManager.shutdown();
  };

  componentWillUnmount(): void {
    window.removeEventListener("gamepadconnected", this.gamepadListener);
    window.cancelAnimationFrame(this.reqId);
  }

  gamepadListener = (event: any) => {
    this.gamepadTick();
  };

  gamepadTick = () => {
    const gamepad = navigator.getGamepads()[0];

    if (gamepad) {
      if (this.state.isDeathMenuActive) {
        const pressed = gamepad.buttons.find(el => el.pressed);
        if (pressed) {
          this.onDeathMenuCheckpointClick();
        }
      }

      const pause = gamepad.buttons[9].pressed;
      const select = gamepad.buttons[8].pressed;
      if (pause && !this.pauseLock) {
        this.pauseLock = true;

        if (this.state.pause) {
          this.onMenuContinueClick();
        } else {
          this.onMenuToggle();
        }
      } else if (this.pauseLock && !pause) {
        this.pauseLock = false;
      }

      if (this.state.pause && select) {
        this.gameManager.shutdown();
        GameProgressService.getInstance().clearProgressInLocalStorage();
        location.href = '/';
      }
    }

    this.reqId = window.requestAnimationFrame(this.gamepadTick);
  };
}
