import * as React from 'react';

import './Load.scss';

interface LoadProps {
  progress: number;
}

export class Load extends React.PureComponent<LoadProps> {
  render() {
    return (
      <div className={`load${this.props.progress === 1 ? ' load_hidden' : ''}`}>
        <div className="load__container">
          <div className="load__icon">
            <div/>
            <div/>
            <div/>
            <div/>
          </div>
          <p className="load__progress">{`${this.props.progress * 100}`.substr(0, 3)}% loaded</p>
          <p className="load__description">Setting up ...</p>
        </div>
      </div>
    );
  }
}
