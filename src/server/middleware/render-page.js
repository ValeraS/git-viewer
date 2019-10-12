import React from 'react';

import { renderToString } from 'react-dom/server';
import { App } from 'components/App/App@server';

export function renderPage() {
  return (req, res) => {
    let content = renderToString(
      <App state={res.locals.state} url={req.url} />
    );

    res.send('<!DOCTYPE html>' + content).end();
  };
}
