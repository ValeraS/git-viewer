import { createElement } from 'react';
import { hydrate } from 'react-dom';
import { App } from 'components/App/App@client';
import { PAGES } from 'pages';
import { getRoute } from 'app-store/selectors/getRoute';
import { AppState } from 'app-store';

declare global {
  interface Window {
      __PRELOADED_STATE__: AppState;
  }
}

const state = window.__PRELOADED_STATE__;

delete window.__PRELOADED_STATE__;

document.addEventListener('DOMContentLoaded', async () => {
  // Load module
  let route = getRoute(state);

  if (route && PAGES[route] && PAGES[route].component) {
    await PAGES[route].component.load();
  }

  hydrate(createElement(App, { state }), document.getElementById('root'));
});
