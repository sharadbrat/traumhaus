import * as React from 'react';
import { Link } from 'react-router-dom';

import './_SettingsPage.scss';

export class SettingsPage extends React.Component<any, any> {

  private onFullscreenButtonClick() {
    const root = document.getElementById('root');
    if (root){
      root.requestFullscreen().catch((e: Error) => {
        alert(`Could not start fullscreen mode!\nError message: ${e.message}`);
      });
    }
  };

  render() {

    return (
      <section className="settings">
        <div className="settings__container">
          <h1 className="settings__heading">Settings</h1>
          <div className="settings__block">
            <h2 className="settings__subheading">Display options</h2>
            <div className="settings__group">
              <span className="settings__label">Fullscreen</span>
              <button className="settings__button" onClick={this.onFullscreenButtonClick}>Enable</button>
            </div>
          </div>
          <Link to="/" className="settings__back">Back to menu</Link>
        </div>
      </section>
    );
  }

}
