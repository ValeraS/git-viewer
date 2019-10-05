import * as React from 'react';

import { cn } from '@bem-react/classname';

import { Switch, Route } from 'react-router';
import { PAGES } from 'pages';

import { useComponentRegistry } from '@bem-react/di';

import 'components/App/App.css';

export const cnApp = cn('App');
export const registryId = cnApp();

export function App() {
  const { Header, Footer } = useComponentRegistry(registryId);
  return (
    <div className={cnApp()}>
      <Header className={cnApp('Header')} />

      <Switch>
        {Object.keys(PAGES).map(route => (
          <Route key={route} {...PAGES[route]} />
        ))}
      </Switch>

      <Footer className={cnApp('Footer')} />
    </div>
  );
}
