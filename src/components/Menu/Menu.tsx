import React from 'react';

import './Menu.scss';

export interface MenuProps {
  heading: string;
  isActive: boolean;
  actions?: React.ReactNode;
  index?: number;
}

export class Menu extends React.PureComponent<MenuProps> {
  render() {
    let menuClass = 'menu';

    if (this.props.isActive) {
      menuClass = menuClass + ' menu_active';
    }

    let footer;
    if (this.props.actions) {
      footer = <footer className="menu__actions">{this.props.actions}</footer>;
    }

    const menuStyle: any = {};
    if (this.props.index) {
      menuStyle.zIndex = this.props.index;
    }

    return (
      <section className={menuClass} style={menuStyle}>
        <div className="menu__container">
          <header className="menu__header">{this.props.heading}</header>
          <main className="menu__main">{this.props.children}</main>
          {footer}
        </div>
      </section>
    );
  }
}
