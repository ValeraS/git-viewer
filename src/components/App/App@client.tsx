import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore, AppState } from 'app-store';
import { App as DesktopApp } from './App@desktop';
import { EnsureResources } from 'components/EnsureResources/EnsureResources@client';
import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';

let BaseApp = DesktopApp;

export interface AppProps {
  state: AppState;
}

export const App: React.FC<AppProps> = function App({ state }) {
  return (
    <Provider store={createStore(state)}>
      <BrowserRouter>
        <ErrorBoundary>
          <EnsureResources>
            {props => (
              <React.Suspense fallback={<h1>Loading...</h1>}>
                <BaseApp {...props} />
              </React.Suspense>
            )}
          </EnsureResources>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
};
