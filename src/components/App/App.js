import * as React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';

import { Switch, Route } from 'react-router';
import { PAGES } from 'pages';

import { useComponentRegistry } from '@bem-react/di';

import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';
import { cnTheme } from 'components/Theme/Theme';
import { cnTypo } from 'components/Typo/Typo';

import './App.css';

export const cnApp = cn('App');
export const registryId = cnApp();

export function App({ location, ...props }) {
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
            {Object.keys(PAGES).map(route => {
              const RouteComponent = routeProps => {
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

App.propTypes = {
  location: PropTypes.object.isRequired,
};
