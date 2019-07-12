import * as React from 'react';

import './DeathMenu.scss';

interface DeathMenuProps {
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
            <h2 className="about__paragraph">Press any button to retry from checkpoint</h2>
          </div>
        </div>
      </div>
    );
  }

}
