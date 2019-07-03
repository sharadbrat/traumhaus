import * as React from 'react';

import './VirtualControls.scss';
import { GameProgressService } from '../../service';

interface VirtualControlsState {
  dash: boolean;
  shoot: boolean;
  transform: boolean;
}

export class VirtualControls extends React.Component<any, VirtualControlsState> {

  state = {
    dash: false,
    shoot: false,
    transform: false,
  };

  componentDidMount(): void {
    GameProgressService.getInstance().setOnDashCooldownChange(this.onDashChange);
    GameProgressService.getInstance().setOnShootCooldownChange(this.onShootChange);
    GameProgressService.getInstance().setOnTransformCooldownChange(this.onTransformChange);
  }

  onDashChange = (val: boolean) => {
    const canDash = GameProgressService.getInstance().getProgress().controls.dash;
    this.setState({dash: val && canDash});
  };

  onShootChange = (val: boolean) => {
    const canShoot = GameProgressService.getInstance().getProgress().controls.shoot;
    this.setState({shoot: val && canShoot});
  };

  onTransformChange = (val: boolean) => {
    const canSwitch = GameProgressService.getInstance().getProgress().controls.switch;
    this.setState({transform: val && canSwitch});
  };

  render() {

    const dashClass = this.state.dash ? 'game__virtual-button' : 'game__virtual-button_active game__virtual-button';
    const shootClass = this.state.shoot ? 'game__virtual-button' : 'game__virtual-button_active game__virtual-button';
    const switchClass = this.state.transform ? 'game__virtual-button' : 'game__virtual-button game__virtual-button_active';

    return (
      <div className="game__virtual-controls">
        <div id="joystick" className="game__virtual-joystick-area"/>
        <div className="game__virtual-buttons">
          <button className="game__virtual-button" id="button-interact"/>
          <button className={switchClass} id="button-switch"/>
          <br/>
          <button className={dashClass} id="button-dash"/>
          <button className={shootClass} id="button-shoot"/>
        </div>
      </div>
    );
  }

}
