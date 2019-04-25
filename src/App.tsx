import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { AboutPage, GamePage, HomePage, SettingsPage } from './pages';

class App extends Component {
  render() {

    return (
      <BrowserRouter>
        <Route component={HomePage} exact path="/"/>
        <Route component={AboutPage} path="/about"/>
        <Route component={SettingsPage} path="/settings"/>
        <Route component={GamePage} path="/game"/>
      </BrowserRouter>
    );
  }
}

export default App;
