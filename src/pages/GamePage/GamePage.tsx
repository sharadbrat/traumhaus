import * as React from 'react';

import './_GamePage.scss';
import { AssetManager, GameManager, GameManagerOptions } from '../../game';
import { GameGhostService, GameMenuService, GameProgressService, GameSoundService } from '../../service';
import { TriggerContents, TriggerManager } from '../../game/TriggerManager';
import { DialogManager, GameDialog, GameDialogStep } from '../../game/dialogs';
import { Dialog } from '../../components';
import { Menu } from '../../components';
import { SceneIdentifier, SceneManager } from '../../game/scenes/SceneManager';
import { LevelManager } from '../../game/levels';
import { GameScene } from '../../game/scenes/GameScene';

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
  }

  componentDidMount(): void {
    const canvas: HTMLCanvasElement = document.getElementById(this.GAME_CANVAS_ID) as HTMLCanvasElement;

    const options: GameManagerOptions = {canvas};

    this.gameManager = new GameManager(options);
    this.gameManager.run();

    GameMenuService.getInstance().setOnMenuToggleListener(() => this.onMenuToggle());

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
            if (dialog.onDialogFinishedTrigger) {
              TriggerManager.fire(dialog.onDialogFinishedTrigger, this.getTriggerContentObject());
            }
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

}
