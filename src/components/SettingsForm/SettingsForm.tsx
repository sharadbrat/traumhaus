import * as React from 'react';
import { Link } from 'react-router-dom';

import './SettingsForm.scss';
import { GameProgressService } from '../../service';

interface SettingsFormProps {
}

export class SettingsForm extends React.PureComponent<SettingsFormProps> {

  private onFullscreenButtonClick() {
    const root = document.documentElement;
    if (root) {
      root.requestFullscreen().catch((e: Error) => {
        alert(`Could not start fullscreen mode!\nError message: ${e.message}`);
      });
    }
  };

  private onClearLocalProgressClick() {
    const sure = confirm('Are you sure you want to clear all the saved progress?\nThis action can\'t be undone!');
    if (sure) {
      GameProgressService.getInstance().clearProgressInLocalStorage();
      alert('Progress has been cleared');
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="settings__block">

          <h2 className="settings__subheading">Display</h2>
          <div className="settings__group">
            <span className="settings__label">Fullscreen</span>
            <button className="settings__button" onClick={this.onFullscreenButtonClick}>Enable</button>
          </div>

          <h2 className="settings__subheading">Progress</h2>
          <div className="settings__group">
            <span className="settings__label">Clear progress</span>
            <button className="settings__button" onClick={this.onClearLocalProgressClick}>Clear</button>
          </div>

        </div>
      </React.Fragment>
    );
  }

}
