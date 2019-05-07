import * as React from 'react';

import './_GamePage.scss';
import { GameManager, GameManagerOptions } from '../../game';
import { Dialog } from '../../components';
import { GameMenuService } from '../../service';
import { TriggerManager } from '../../game/TriggerManager';
import { LEVEL_1_TRIGGERS } from '../../game/levels';

interface GamePageProps {
  history: History;
}

interface GamePageState {
  pause: boolean;
}

export class GamePage extends React.Component<any, GamePageState> {

  private readonly GAME_CANVAS_ID = 'game__canvas';

  private gameManager: GameManager;
  private canvasRef: React.Ref<HTMLCanvasElement>;

  state = {
    pause: false,
  };

  constructor(props: GamePageProps) {
    super(props);

    TriggerManager.add(LEVEL_1_TRIGGERS.ON_PROFESSOR_COLLIDE, ((scene, object, player) => {
      console.log('collision happened!');
    }));

    TriggerManager.add(LEVEL_1_TRIGGERS.ON_PROFESSOR_ACTION, (((scene, object, player) => {
      console.log('action')
    })));
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

  render() {
    return (
      <section className="game">
        <div className="game__container">
          <canvas ref={this.canvasRef} id={this.GAME_CANVAS_ID} className="game__canvas"/>
          <Dialog heading="Pause" isActive={this.state.pause}>
            <button className="game__menu-option" onClick={this.onMenuContinueClick}>Continue</button>
            <button className="game__menu-option" onClick={this.onMenuSettingsClick}>Settings</button>
            <button className="game__menu-option" onClick={this.onMenuExitClick}>Exit to main menu</button>
          </Dialog>
        </div>
      </section>
    );
  }

}
