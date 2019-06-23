import * as React from 'react';

import './DeathMenu.scss';

interface DeathMenuProps {
  onGoToMainMenu: () => any;
  onGoToCheckpoint: () => any;
  show: boolean;
}

export class DeathMenu extends React.Component<DeathMenuProps> {

  render() {
    let className = 'death-menu';
    if (this.props.show) {
      className = 'death-menu death-menu_active';
    }

    return (
      <div className={className}>
        <div className="death-menu__container">
          <h1 className="death-menu__heading">Wasted</h1>
          <div className="death-menu__options">
            <button className="death-menu__button" onClick={this.props.onGoToMainMenu}>Go to main menu</button>
            <button className="death-menu__button" onClick={this.props.onGoToCheckpoint}>Start from checkpoint</button>
          </div>
        </div>
      </div>
    );
  }

}
