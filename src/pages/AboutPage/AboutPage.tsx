import * as React from 'react';

import './_AboutPage.scss';
import { Link } from 'react-router-dom';

export class AboutPage extends React.Component {

  render() {
    return (
      <section className="about">
        <div className="about__container">
          <h1 className="about__heading">About the game</h1>
          <div className="about__block">
            <h2 className="about__subheading">Description</h2>
            <p className="about__paragraph">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ad, adipisci aut blanditiis commodi corporis debitis error facere illo in ipsa, iure magnam nemo nesciunt obcaecati quis rem unde veniam.</p>
          </div>
          <div className="about__block">
            <h2 className="about__subheading">Authors</h2>
            <p className="about__paragraph _jacob">Jacob - music</p>
            <p className="about__paragraph _florian">Florian - graphics</p>
            <p className="about__paragraph _georgii">Georgii - code</p>
          </div>
          <Link to="/" className="about__back">Back to menu</Link>
        </div>
      </section>
    );
  }

}
