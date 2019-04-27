import React from 'react';

import './Dialog.scss';

export interface DialogProps {
  heading: string;
  isActive: boolean;
  actions?: React.ReactNode;
}

export class Dialog extends React.PureComponent<DialogProps> {
  render() {
    let dialogClass = 'dialog';

    if (this.props.isActive) {
      dialogClass = dialogClass + 'dialog_active';
    }

    let footer;
    if (this.props.actions) {
      footer = <footer className="dialog__actions">{this.props.actions}</footer>;
    }

    return (
      <section className={dialogClass}>
        <div className="dialog__container">
          <header className="dialog__header">{this.props.heading}</header>
          <main className="dialog__main">{this.props.children}</main>
          {footer}
        </div>
      </section>
    );
  }
}
