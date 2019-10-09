import * as React from 'react';
import { cn } from '@bem-react/classname';

import { Switch, Route } from 'react-router';
import { PAGES } from 'pages';

import { useComponentRegistry } from '@bem-react/di';

import { cnTheme } from 'components/Theme/Theme';
import { cnTypo } from 'components/Typo/Typo';

import './App.css';

export const cnApp = cn('App');
export const registryId = cnApp();

export function App() {
  const { Header, Footer } = useComponentRegistry(registryId);

  return (
    <div
      className={cnApp(null, [
        cnTheme({ color: 'default', size: 'default', space: 'default' }),
        cnTypo(),
      ])}
    >
      <Header className={cnApp('Header')} />
      <AppMain />
      <Footer className={cnApp('Footer')} />
    </div>
  );
}

function AppMain() {
  return (
    <main className={cnApp('Main')}>
      <Switch>
        {Object.keys(PAGES).map(route => (
          <Route key={route} {...PAGES[route]} />
        ))}
      </Switch>
    </main>
  );
}
