import * as React from 'react';

import './_GamePage.scss';
import { GameManager } from '../../game';

export class GamePage extends React.Component {

  private readonly GAME_CANVAS_ID = 'game__canvas';

  private gameManager: GameManager;
  private canvasRef: React.Ref<HTMLCanvasElement>;

  componentDidMount(): void {
    const canvas: HTMLCanvasElement = document.getElementById(this.GAME_CANVAS_ID) as HTMLCanvasElement;
    this.gameManager = new GameManager(canvas)
    this.gameManager.run();
  }

  render() {
    return (
      <section className="game">
        <div className="game__container">
          <canvas ref={this.canvasRef} id={this.GAME_CANVAS_ID} className="game__canvas"/>
          {/*<iframe src="https://dungeon-dash.surge.sh"/>*/}
        </div>
      </section>
    );
  }

}
