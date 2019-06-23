import * as React from 'react';
import { Link } from 'react-router-dom';

import { SettingsForm } from '../../components/SettingsForm';

import './_SettingsPage.scss';

export class SettingsPage extends React.Component<any, any> {

  render() {

    return (
      <section className="settings">
        <div className="settings__container">
          <h1 className="settings__heading">Settings</h1>
          <SettingsForm/>
          <Link to="/" className="settings__back">Back to menu</Link>
        </div>
      </section>
    );
  }

}
