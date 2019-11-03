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
          <p className="load__progress">{`${this.props.progress * 100}`.substr(0, 3)}% loaded</p>
        </div>
      </div>
    );
  }
}
