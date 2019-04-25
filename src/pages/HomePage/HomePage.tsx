import * as React from 'react';
import { Link } from 'react-router-dom';

import './_HomePage.scss';

export class HomePage extends React.Component {

  render() {
    return (
      <section className="home">
        <div className="home__container">
          <h1 className="home__heading">8-bit of<br/><span className="home__heading_special">bauhaus</span></h1>
          <div className="home__group">
            <Link to="game" className="home__link">Play</Link>
            <Link to="settings" className="home__link">Settings</Link>
            <Link to="about" className="home__link">About</Link>
          </div>
        </div>
      </section>
    );
  }

}
