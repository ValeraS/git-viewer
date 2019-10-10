import React from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore } from 'app-store';
import { App as DesktopApp } from './App@desktop';
import { EnsureResources } from 'components/EnsureResources/EnsureResources@client';

let BaseApp;
BaseApp = DesktopApp;

export const App = function App({ state }) {
  return (
    <Provider store={createStore(state)}>
      <BrowserRouter>
        <EnsureResources>
          {props => (
            <React.Suspense fallback={<h1>Loading...</h1>}>
              <BaseApp {...props} />
            </React.Suspense>
          )}
        </EnsureResources>
      </BrowserRouter>
    </Provider>
  );
};

App.propTypes = {
  state: PropTypes.object,
};
