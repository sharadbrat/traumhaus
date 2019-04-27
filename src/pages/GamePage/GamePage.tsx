import * as React from 'react';

import './_GamePage.scss';
import { GameManager, GameManagerOptions } from '../../game';
import { Dialog } from '../../components';

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

  componentDidMount(): void {
    const canvas: HTMLCanvasElement = document.getElementById(this.GAME_CANVAS_ID) as HTMLCanvasElement;

    const options: GameManagerOptions = {
      canvas,
      onGamePause: () => this.setState({ pause: true })
    };

    this.gameManager = new GameManager(options);
    this.gameManager.run();
  }

  render() {
    return (
      <section className="game">
        <div className="game__container">
          <canvas ref={this.canvasRef} id={this.GAME_CANVAS_ID} className="game__canvas"/>
          <Dialog heading="Pause" isActive={this.state.pause}/>
        </div>
      </section>
    );
  }

}
