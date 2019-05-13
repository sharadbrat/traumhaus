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
            <p className="about__paragraph">This game is an interdisciplinary project of students from Bauhaus Universität. It was developed under the "8-bit of Bauhaus" project held by Gianluca Pandolfo.</p>
          </div>
          <div className="about__block">
            <h2 className="about__subheading">Authors</h2>
            <p className="about__paragraph _jacob">Jacob Januar - music</p>
            <p className="about__paragraph _florian">Florian Batze - graphics</p>
            <p className="about__paragraph _georgii">Georgii Sharadze - code</p>
          </div>
          <Link to="/" className="about__back">Back to menu</Link>
        </div>
      </section>
    );
  }

}
