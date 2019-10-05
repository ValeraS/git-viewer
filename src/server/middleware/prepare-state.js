// import { getData } from 'server/dataSource';
import { rootReducer } from 'app-store';
import { matchUrl } from 'server/utils/matchUrl';

export function prepareState() {
  return async function(req, res, next) {
    try {
      let router = matchUrl(req.url);

      if (!router) {
        return res.status(404).end();
      }

      let state = {
        ...rootReducer(undefined, { type: 'INIT' }),
        // ...(await getData(router)),
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
