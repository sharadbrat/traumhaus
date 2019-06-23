import * as React from 'react';

import { Menu } from '../Menu';
import { SettingsForm } from '../SettingsForm';

import './SettingsMenu.scss';

interface SettingsMenuProps {
  isActive: boolean;
  onClose: () => any;
}

export class SettingsMenu extends React.Component<SettingsMenuProps> {

  render() {
    return (
      <Menu heading="Settings" isActive={this.props.isActive} index={1001}>
        <SettingsForm/>
        <button className="settings__back" onClick={this.props.onClose}>Back to menu</button>
      </Menu>
    );
  }

}
