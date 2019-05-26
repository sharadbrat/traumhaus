import * as React from 'react';
import { Link } from 'react-router-dom';
import { History } from 'history';

import './_HomePage.scss';
import { GameProgress, GameProgressService } from '../../service';

interface HomePageProps {
  history: History;
}

export class HomePage extends React.Component<HomePageProps> {

  private progress: GameProgress;

  componentWillMount(): void {
    this.progress = GameProgressService.getInstance().getProgressFromLocalStorage();
  }

  onContinueClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (this.progress) {
      GameProgressService.getInstance().loadProgress(this.progress);
      this.props.history.push('/game')
    }
  };

  render() {
    return (
      <section className="home">
        <div className="home__container">
          <h1 className="home__heading">TRAUMHAUS</h1>
          <div className="home__group">
            <Link to="game" className="home__link">New game</Link>
            <Link aria-disabled={!this.progress} to="game" className={`home__link${this.progress ? '' : ' home__link_inactive'}`} onClick={this.onContinueClick}>Continue</Link>
            <Link to="settings" className="home__link">Settings</Link>
            <Link to="about" className="home__link">About</Link>
          </div>
        </div>
      </section>
    );
  }

}
