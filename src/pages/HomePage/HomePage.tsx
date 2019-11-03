import * as React from 'react';
import { Link } from 'react-router-dom';
import { History } from 'history';

import { GameProgress, GameProgressService } from '../../service';
import { ControlsType, GameControlsService } from '../../service/GameControlsService';

import './_HomePage.scss';

interface HomePageProps {
  history: History;
}

interface HomePageState {
  isControlsMenuActive: boolean;
}

export class HomePage extends React.Component<HomePageProps, HomePageState> {

  private progress: GameProgress;

  state = {
    isControlsMenuActive: false
  };

  componentDidMount(): void {
    this.progress = GameProgressService.getInstance().getProgressFromLocalStorage();
  }


  onNewGameClick = (event: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }

    GameControlsService.getInstance().setMode(ControlsType.KEYBOARD);
    this.props.history.push('/game');
  };


  render() {
    return (
      <section className="home">
        <div className="home__container">
          <img className="home__heading" src="/image/logo_black.png" alt="Traumhaus game"/>
          <div className="home__group">
            <Link to="game" className="home__link" onClick={this.onNewGameClick}>New game</Link>
            <Link to="about" className="home__link">About</Link>
            <button className="home__link hide_fullscreen home__link_option" onClick={this.enableFullscreen}>Enable fullscreen</button>
          </div>
        </div>
      </section>
    );
  }

  private enableFullscreen() {
    const root = document.getElementById('root');
    if (root) {
      root.requestFullscreen().catch((e: Error) => {
        console.log(`Could not start fullscreen mode!\nError message: ${e.message}`);
      });
    }
  }

}
