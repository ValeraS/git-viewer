import * as React from 'react';
import { cn } from '@bem-react/classname';

import { Switch, Route, RouteProps } from 'react-router';
import { PAGES, Routes } from 'pages';

import { useComponentRegistry } from '@bem-react/di';

import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';
import { cnTheme } from 'components/Theme/Theme';
import { cnTypo } from 'components/Typo/Typo';

import './App.css';
import { Location } from 'history';
import { RepoState } from 'app-store/repo/types';
import { PageData } from 'app-store/page-data/types';

export const cnApp = cn('App');
export const registryId = cnApp();

export interface PageResources {
  location: Location;
  repo: RepoState;
  data: PageData;
}

export interface AppProps {
  location: Location;
}

export function App({ location, ...props }: PageResources) {
  const { Header, Footer } = useComponentRegistry(registryId);

  return (
    <div
      className={cnApp(null, [
        cnTheme({ color: 'default', size: 'default', space: 'default' }),
        cnTypo(),
      ])}
    >
      <Header className={cnApp('Header')} />
      <ErrorBoundary>
        <main className={cnApp('Main')}>
          <Switch location={location}>
            {(Object.keys(PAGES) as Routes[]).map(route => {
              const RouteComponent = (routeProps: RouteProps) => {
                const Component = PAGES[route].component;
                return <Component {...routeProps} {...props} />;
              };
              return (
                <Route
                  key={route}
                  {...PAGES[route]}
                  component={RouteComponent}
                />
              );
            })}
          </Switch>
        </main>
      </ErrorBoundary>
      <Footer className={cnApp('Footer')} />
    </div>
  );
}
