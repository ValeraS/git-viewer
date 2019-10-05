import React from 'react';

import { renderToStaticMarkup } from 'react-dom/server';
import { App } from 'components/App/App@server';

export function renderPage() {
  return (req, res) => {
    let content = renderToStaticMarkup(
      <App state={res.locals.state} url={req.url} />
    );

    res.send('<!DOCTYPE html>' + content).end();
  };
}
