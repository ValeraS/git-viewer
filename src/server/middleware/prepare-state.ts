import { getData } from 'server/dataSources';
import { rootReducer } from 'app-store';
import { matchUrl } from 'server/utils/matchUrl';
import { Request, Response, NextFunction } from 'express';

export function prepareState() {
  return async function(req: Request, res: Response, next: NextFunction) {
    try {
      const router = matchUrl(req.url);

      if (!router) {
        return res.status(404).end();
      }

      const state = {
        ...rootReducer(undefined, { type: 'INIT' }),
        router,
        ...(await getData(router)),
      };

      res.locals.state = {
        files: {},
        css: [],
        js: [],

        state,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
}
