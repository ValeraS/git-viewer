import React from 'react';

import { Provider } from 'react-redux';
import { createStore } from 'app-store';
import { ExpressState } from 'server/schema/express-state';
import { App as BaseApp } from './App@desktop';
import { StaticRouter } from 'react-router';

import { EnsureResources } from 'components/EnsureResources/EnsureResurces@server';
import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';

import htmlEscapeJson from 'htmlescape';
import { PageResources } from './App';

export interface AppProps {
  state: ExpressState;
  url: string;
}
export const App: React.FC<AppProps> = function App({
  url,
  state: { state, js, css },
}) {
  const store = createStore(state);

  return (
    <Provider store={store}>
      <StaticRouter location={url}>
        <html lang="ru">
          <head>
            {css.map(file => (
              <link rel="stylesheet" href={file} key={file} />
            ))}

            <title>ШРИ: Arcanum</title>

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </head>
          <body>
            <div id="root">
              <ErrorBoundary>
                <EnsureResources>
                  {(props: PageResources) => <BaseApp {...props} />}
                </EnsureResources>
              </ErrorBoundary>
            </div>

            <script
              dangerouslySetInnerHTML={{
                __html: `window.__PRELOADED_STATE__=${htmlEscapeJson(
                  store.getState()
                )}`,
              }}
            />

            {js.map(file => (
              <script src={file} key={file} defer />
            ))}
          </body>
        </html>
      </StaticRouter>
    </Provider>
  );
};
