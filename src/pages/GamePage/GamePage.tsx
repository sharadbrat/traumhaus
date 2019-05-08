import * as React from 'react';

import './_GamePage.scss';
import { GameManager, GameManagerOptions } from '../../game';
import { GameMenuService } from '../../service';
import { TriggerManager } from '../../game/TriggerManager';
import { LEVEL_1_TRIGGERS } from '../../game/levels';
import { DialogManager, GameDialog, GameDialogStep } from '../../game/dialogs';
import { LEVEL_1_DIALOGS, LEVEL_1_DIALOGS_IDS } from '../../game/dialogs/dialogs-level-1';
import { Dialog } from '../../components';
import { Menu } from '../../components';

interface GamePageProps {
  history: History;
}

interface GamePageState {
  pause: boolean;
  dialogStep: GameDialogStep | undefined;
  isDialogActive: boolean;
}

const ACTION_BUTTON_CODE = ' ';

export class GamePage extends React.Component<any, GamePageState> {

  private readonly GAME_CANVAS_ID = 'game__canvas';

  private gameManager: GameManager;
  private canvasRef: React.Ref<HTMLCanvasElement>;

  state = {
    pause: false,
    isDialogActive: false,

    // @ts-ignore
    dialogStep: undefined,
  };

  constructor(props: GamePageProps) {
    super(props);

    DialogManager.initialize(this.onDialogStart);

    DialogManager.registerDialogs(LEVEL_1_DIALOGS);
  }

  componentDidMount(): void {
    const canvas: HTMLCanvasElement = document.getElementById(this.GAME_CANVAS_ID) as HTMLCanvasElement;

    const options: GameManagerOptions = {
      canvas,
      onGamePause: () => this.setState({ pause: true })
    };

    this.gameManager = new GameManager(options);
    this.gameManager.run();

    GameMenuService.getInstance().setOnMenuToggleListener(() => this.onMenuToggle());

    registerTriggers();

  }

  onMenuToggle() {
    this.gameManager.pause();
    this.setState({pause: true});
  }

  onMenuContinueClick = () => {
    this.gameManager.resume();
    this.setState({pause: false});
  };

  onMenuSettingsClick = () => {
    this.setState({pause: false});
  };

  onMenuExitClick = () => {
    this.props.history.push('/');
    this.setState({pause: false});
  };

  onDialogStart = (dialog: GameDialog) => {
    if (!this.state.isDialogActive) {
      this.gameManager.pause();

      let currentStep = 0;

      this.setState({isDialogActive: true, dialogStep: dialog.steps[currentStep]});

      const keydownListener = (event: KeyboardEvent) => {
        event.stopPropagation();

        if (event.key === ACTION_BUTTON_CODE) {
          currentStep++;

          if (dialog.steps[currentStep]) {
            this.setState({dialogStep: dialog.steps[currentStep]});
          } else {
            this.gameManager.resume();
            window.removeEventListener('keydown', keydownListener);
            this.setState({dialogStep: null, isDialogActive: false});
            TriggerManager.fire(dialog.onDialogFinishedTrigger, null, null, null);
          }
        }
      };

      window.addEventListener('keydown', keydownListener, false);
    }
  };

  render() {
    return (
      <section className="game">
        <div className="game__container">
          <canvas ref={this.canvasRef} id={this.GAME_CANVAS_ID} className="game__canvas"/>
          <Menu heading="Pause" isActive={this.state.pause}>
            <button className="game__menu-option" onClick={this.onMenuContinueClick}>Continue</button>
            <button className="game__menu-option" onClick={this.onMenuSettingsClick}>Settings</button>
            <button className="game__menu-option" onClick={this.onMenuExitClick}>Exit to main menu</button>
          </Menu>
          <Dialog step={this.state.dialogStep} isActive={this.state.isDialogActive}/>
        </div>
      </section>
    );
  }

}

function registerTriggers() {
  TriggerManager.add(LEVEL_1_TRIGGERS.ON_PROFESSOR_COLLIDE, ((scene, object, player) => {
    console.log('collision happened!');
  }));

  TriggerManager.add(LEVEL_1_TRIGGERS.ON_PROFESSOR_ACTION, ((scene, object, player) => {
    console.log('action!');
    DialogManager.runDialog(LEVEL_1_DIALOGS_IDS.PROFESSOR_DIALOG);
  }));

  TriggerManager.add(LEVEL_1_TRIGGERS.ON_PROFESSOR_DIALOG_FINISHED, ((scene, object, player) => {
    console.log('Wow!');
  }))
}
