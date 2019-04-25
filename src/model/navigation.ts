import React from 'react';

export interface INavigationItem {
  url: string;
  component: typeof React.Component;
  name: string;
  exact: boolean;
}
