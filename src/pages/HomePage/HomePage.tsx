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

  state = {
    isControlsMenuActive: false
  };

  componentWillMount(): void {
    this.progress = GameProgressService.getInstance().getProgressFromLocalStorage();
  }

  onContinueClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (this.progress) {
      GameProgressService.getInstance().loadProgress(this.progress);
      this.setState({isControlsMenuActive: true});
    }
  };

  onNewGameClick = (event: React.MouseEvent) => {
    event.preventDefault();
    this.setState({isControlsMenuActive: true});
  };

  onControlsModeSelect = (mode: ControlsType) => {
    this.enableFullscreen();

    this.setState({isControlsMenuActive: false});
    GameControlsService.getInstance().setMode(mode);
    setTimeout(() => this.props.history.push('/game'), 100)
  };

  render() {
    return (
      <section className="home">
        <div className="home__container">
          <img className="home__heading" src="/image/logo_black.png" alt="Traumhaus game"/>
          <div className="home__group">
            <Link to="game" className="home__link" onClick={this.onNewGameClick}>New game</Link>
            <Link aria-disabled={!this.progress} to="game" className={`home__link${this.progress ? '' : ' home__link_inactive'}`} onClick={this.onContinueClick}>Continue</Link>
            <Link to="settings" className="home__link">Settings</Link>
            <Link to="about" className="home__link">About</Link>
          </div>
        </div>
        <ControlsMenu isActive={this.state.isControlsMenuActive} onControlsModeSelect={this.onControlsModeSelect}/>
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
