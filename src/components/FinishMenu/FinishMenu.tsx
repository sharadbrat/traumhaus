import * as React from 'react';

import { Menu } from '../Menu';

import './FinishMenu.scss';

interface SettingsMenuProps {
  isActive: boolean;
  onClose: () => any;
  history: any;
}

export class FinishMenu extends React.Component<SettingsMenuProps> {

  componentDidMount(): void {
    document.addEventListener('keydown', this.close);
  }

  componentWillUnmount(): void {
    document.removeEventListener('keydown', this.close);
  }

  private close = () => {
    this.props.onClose();
    this.props.history.push('/');
  };

  render() {
    return (
      <Menu heading="Credits" isActive={this.props.isActive} index={1003}>
        <div className="settings__block">
          <div className="about__block">
            <p className="about__paragraph">This game is an interdisciplinary project of students from Bauhaus Universität. It was developed under the "8-bit of Bauhaus" project held by Gianluca Pandolfo.</p>
          </div>
          <div className="about__block">
            <h2 className="about__subheading">Authors</h2>
            <p className="about__paragraph _jacob">Jacob Januar - music</p>
            <p className="about__paragraph _florian">Florian Batze - graphics</p>
            <p className="about__paragraph _georgii">Georgii Sharadze - code</p>
          </div>

          <div className="about__block">
            <h2 className="about__subheading">Special thanks</h2>
            <p className="about__paragraph">Special thanks for your support and playtesting: Elli, Hannah, Konrad</p>
            <p className="about__paragraph">Thank you for making it possible: Nikolay Volkov</p>
          </div>

          <div className="about__block">
            <h2 className="about__subheading">Thank you for playing!</h2>
            <p className="about__paragraph">Press any key to go to main menu</p>
          </div>
        </div>
      </Menu>
    );
  }

}
