import React from 'react';

import './Dialog.scss';
import { DialogManager, GameDialogStep } from '../../game/dialogs/DialogManager';

export interface DialogProps {
  step: GameDialogStep;
  isActive: boolean;
}

export class Dialog extends React.PureComponent<DialogProps> {
  render() {
    let dialogClass = 'dialog';

    if (this.props.isActive) {
      dialogClass = dialogClass + ' dialog_active';
    }

    if (this.props.step) {
      const actor = this.props.step.actor;
      const portraitStyle = {
        backgroundImage: `url(${actor.image})`,
      };

      return (
        <section className={dialogClass}>
          <div className="dialog__container">
            <div className="dialog__group">
              <div className="dialog__title">{actor.title}</div>
              <div className="dialog__portrait" style={portraitStyle}/>
            </div>
            <div className="dialog__phrase">{this.props.step.phrase}</div>
          </div>
        </section>
      );
    } else {
      return (
        <section className={dialogClass}>
          <div className="dialog__container"/>
        </section>
      );
    }
  }
}
