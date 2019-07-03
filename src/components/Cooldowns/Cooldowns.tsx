import * as React from 'react';

import './Cooldowns.scss';
import { GameProgressService } from '../../service';

interface CooldownsState {
  dash: boolean;
  shoot: boolean;
  transform: boolean;
}

export class Cooldowns extends React.PureComponent<any, CooldownsState> {

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
    this.setState({dash: val});
  };

  onShootChange = (val: boolean) => {
    this.setState({shoot: val});
  };

  onTransformChange = (val: boolean) => {
    this.setState({transform: val});
  };

  render() {
    const dashClass = this.state.dash ? 'cooldown cooldown_dash cooldown_active' : 'cooldown cooldown_dash';
    const shootClass = this.state.shoot ? 'cooldown cooldown_shoot cooldown_active' : 'cooldown cooldown_shoot';
    const transformClass = this.state.transform ? 'cooldown cooldown_transform cooldown_active' : 'cooldown cooldown_transform';

    return (
      <div className="cooldowns">
        <div className={transformClass}/>
        <div className={dashClass}/>
        <div className={shootClass}/>
      </div>
    );
  }
}
