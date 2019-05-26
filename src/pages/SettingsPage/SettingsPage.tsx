import * as React from 'react';
import { Link } from 'react-router-dom';

import { GameProgress, GameProgressService } from '../../service';

import './_SettingsPage.scss';

export class SettingsPage extends React.Component<any, any> {

  private progress: GameProgress;

  componentDidMount(): void {
    this.progress = GameProgressService.getInstance().getProgressFromLocalStorage();
  }

  private onFullscreenButtonClick() {
    const root = document.getElementById('root');
    if (root){
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
      <section className="settings">
        <div className="settings__container">
          <h1 className="settings__heading">Settings</h1>
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
          <Link to="/" className="settings__back">Back to menu</Link>
        </div>
      </section>
    );
  }

}
