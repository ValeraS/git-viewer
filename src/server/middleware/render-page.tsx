import React from 'react';
import { renderToString } from 'react-dom/server';

import { App } from 'components/App/App@server';
import { Request, Response } from 'express';

export function renderPage() {
  return (req: Request, res: Response) => {
    const content = renderToString(
      <App state={res.locals.state} url={req.url} />
    );

    res.send('<!DOCTYPE html>' + content).end();
  };
}
