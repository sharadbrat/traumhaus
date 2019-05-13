import * as React from 'react';
import { Link } from 'react-router-dom';

import './_HomePage.scss';
import { GameDataService } from '../../service';

export class HomePage extends React.Component {

  onContinueClick(event: React.MouseEvent) {
    event.preventDefault();
    GameDataService.getInstance().loadGameData();
  }

  render() {
    return (
      <section className="home">
        <div className="home__container">
          <h1 className="home__heading">TRAUMHAUS</h1>
          <div className="home__group">
            <Link to="game" className="home__link">New game</Link>
            <Link to="game" className="home__link" onClick={this.onContinueClick}>Continue</Link>
            <Link to="settings" className="home__link">Settings</Link>
            <Link to="about" className="home__link">About</Link>
          </div>
        </div>
      </section>
    );
  }

}
