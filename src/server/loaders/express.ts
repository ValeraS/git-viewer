import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { join } from 'path';
import { api } from 'server/config';
import apiRoutes from 'server/api';
import { errorHandler } from 'server/middleware/error-handler';
import { notFoundHandler } from 'server/middleware/not-found-handler';
import { renderPage } from 'server/middleware/render-page';
import { prepareState } from 'server/middleware/prepare-state';
import { clientAssets } from 'server/middleware/client-assets';

export default ({ app }: { app: Express }) => {
  // Health Check endpoints
  app.get('/status', (_, res) => res.sendStatus(200));
  app.head('/status', (_, res) => res.sendStatus(200));

  app.use(express.static(join(__dirname, 'client')));

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  // Load API routes
  app.use(api.prefix, apiRoutes());

  // Normal page rendering process
  app.use(prepareState());
  app.use(clientAssets());
  app.use(renderPage());

  // Catch 404
  app.use(notFoundHandler());

  // error handler
  app.use(errorHandler());
};
