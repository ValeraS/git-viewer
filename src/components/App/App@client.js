import React from 'react';
import PropTypes from 'prop-types';

import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore } from 'app-store';
import { App as BaseApp } from 'components/App/App@desktop';

export const App = function App({ state }) {
  return (
    <Provider store={createStore(state)}>
      <BrowserRouter>
        <React.Suspense fallback={<h1>Loading...</h1>}>
          <BaseApp />
        </React.Suspense>
      </BrowserRouter>
    </Provider>
  );
};

App.propTypes = {
  state: PropTypes.object,
};
