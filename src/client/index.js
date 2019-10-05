import React from 'react';
import { hydrate } from 'react-dom';
import { App } from 'components/App/App@client';
import { PAGES } from 'pages';
import { getRoute } from 'app-store/selectors/getRoute';

const state = window.__PRELOADED_STATE__;

delete window.__PRELOADED_STATE__;

document.addEventListener('DOMContentLoaded', async () => {
  // Load module
  let route = getRoute(state);

  if (route && PAGES[route]) {
    await PAGES[route].component.load();
  }

  hydrate(<App state={state} />, document.getElementById('root'));
});
