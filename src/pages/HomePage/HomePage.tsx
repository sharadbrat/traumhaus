import * as React from 'react';
import { Link } from 'react-router-dom';
import { History } from 'history';

import './_HomePage.scss';
import { GameProgress, GameProgressService } from '../../service';
import { ControlsMenu } from '../../components/ControlsMenu';
import { ControlsType, GameControlsService } from '../../service/GameControlsService';

interface HomePageProps {
  history: History;
}

interface HomePageState {
  isControlsMenuActive: boolean;
}

export class HomePage extends React.Component<HomePageProps, HomePageState> {

  private progress: GameProgress;

  private reqId: number;

  state = {
    isControlsMenuActive: false
  };

  componentDidMount(): void {
    this.progress = GameProgressService.getInstance().getProgressFromLocalStorage();

    if (navigator.getGamepads()[0]) {
      this.gamepadTick()
    } else {
      window.addEventListener("gamepadconnected", this.gamepadListener);
    }

    setTimeout(() => {
      this.enableFullscreen();
    }, 500);
  }

  componentWillUnmount(): void {
    window.removeEventListener("gamepadconnected", this.gamepadListener);
    window.cancelAnimationFrame(this.reqId);
  }

  gamepadListener = (event: any) => {
    this.gamepadTick()
  };

  gamepadTick = () => {
    const gamepad = navigator.getGamepads()[0];

    if (gamepad) {
      const pressed = gamepad.buttons.filter((el, i) => i !== 8 && i !== 9).find(el => el.pressed);

      if (pressed) {
        this.onNewGameClick(null);
      }
    }

    this.reqId = window.requestAnimationFrame(this.gamepadTick);
  };

  onNewGameClick = (event: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    this.enableFullscreen();
    GameControlsService.getInstance().setMode(ControlsType.GAMEPAD);
    setTimeout(() => this.props.history.push('/game'), 100)
  };

  render() {
    return (
      <section className="home">
        <div className="home__container">
          <img className="home__heading" src="/image/logo_black.png" alt="Traumhaus game"/>
          <div className="home__group">
            <Link to="game" className="home__link" onClick={this.onNewGameClick}>(Press any button)</Link>
          </div>
        </div>
      </section>
    );
  }

  private enableFullscreen() {
    const root = document.getElementById('root');
    if (root) {
      root.requestFullscreen().catch((e: Error) => {
        alert(`Could not start fullscreen mode!\nError message: ${e.message}`);
      });
    }
  }

}
