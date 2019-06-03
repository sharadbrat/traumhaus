import * as React from 'react';

import { Menu } from '../Menu';
import { ControlsType } from '../../service/GameControlsService';

import './ControlsMenu.scss';

interface ControlsMenuProps {
  isActive: boolean;
  onControlsModeSelect(mode: ControlsType): void;
}

export class ControlsMenu extends React.PureComponent<ControlsMenuProps> {

  private onKeyboardClick = () => {
    this.props.onControlsModeSelect(ControlsType.KEYBOARD);
  };

  private onGamepadClick = () => {
    this.props.onControlsModeSelect(ControlsType.GAMEPAD);
  };

  private onTouchClick = () => {
    this.props.onControlsModeSelect(ControlsType.ON_SCREEN);
  };

  render() {
    return (
      <Menu heading="Controls" isActive={this.props.isActive}>
        <ul className="controls-menu">
          <li className="controls-menu__item">Which controls do you want to use?</li>
          <li className="controls-menu__item">
            <button className="controls-menu__button" onClick={this.onKeyboardClick}>Keyboard</button>
          </li>
          <li className="controls-menu__item">
            <button className="controls-menu__button" onClick={this.onGamepadClick}>Gamepad</button>
          </li>
          <li className="controls-menu__item">
            <button className="controls-menu__button" onClick={this.onTouchClick}>Touch (for mobile)</button>
          </li>
        </ul>
      </Menu>
    );
  }
}
