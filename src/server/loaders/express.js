import bodyParser from 'body-parser';
import { api } from 'server/config';
import routes from 'server/api';

export default ({ app }) => {
  // Health Check endpoints
  app.get('/status', (req, res) => res.sendStatus(200));
  app.head('/status', (req, res) => res.sendStatus(200));

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  // Load API routes
  app.use(api.prefix, routes());

  // Catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
