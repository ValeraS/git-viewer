import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cn } from '@bem-react/classname';

import { Switch, Route, useRouteMatch } from 'react-router';
import { PAGES } from 'pages';

import { useComponentRegistry } from '@bem-react/di';

import { cnTheme } from 'components/Theme/Theme';
import { cnTypo } from 'components/Typo/Typo';

import { getRepo } from 'app-store/selectors/repo';

import './App.css';
import { setRepoState, fetchRepo } from 'app-store/repo/actions';

export const cnApp = cn('App');
export const registryId = cnApp();

export function App() {
  const { Header, Footer } = useComponentRegistry(registryId);
  useRepo();
  const { loading, error } = useSelector(getRepo) || {};

  return (
    <div
      className={cnApp(null, [
        cnTheme({ color: 'default', size: 'default', space: 'default' }),
        cnTypo(),
      ])}
    >
      <Header className={cnApp('Header')} />
      {!loading && !error && <AppMain />}
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error</h1>}
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

function useRepo() {
  const match = useRouteMatch('/:repoId');
  const { repoId } = useSelector(getRepo) || {};
  const dispatch = useDispatch();

  if ((!match && !repoId) || match.params.repoId === repoId) {
    return;
  }

  if (!match) {
    return dispatch(setRepoState(null));
  }

  dispatch(setRepoState({ repoId: match.params.repoId }));
  return dispatch(fetchRepo(match.params.repoId));
}
