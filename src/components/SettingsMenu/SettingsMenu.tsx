import * as React from 'react';

import { Menu } from '../Menu';

import './SettingsMenu.scss';

interface SettingsMenuProps {
  isActive: boolean;
  onClose: () => any;
}

export class SettingsMenu extends React.Component<SettingsMenuProps> {

  private onFullscreenButtonClick() {
    const root = document.getElementById('root');
    if (root) {
      root.requestFullscreen().catch((e: Error) => {
        alert(`Could not start fullscreen mode!\nError message: ${e.message}`);
      });
    }
  };

  render() {
    return (
      <Menu heading="Settings" isActive={this.props.isActive} index={1001}>
        <div className="settings__block">

          <h2 className="settings__subheading">Display</h2>
          <div className="settings__group">
            <span className="settings__label">Fullscreen</span>
            <button className="settings__button" onClick={this.onFullscreenButtonClick}>Enable</button>
          </div>

        </div>
        <button className="settings__back" onClick={this.props.onClose}>Back to menu</button>
      </Menu>
    );
  }

}
