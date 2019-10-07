import { Router } from 'express';
import { Container } from 'typedi';
import { currentRepoHandler } from 'server/api/middleware/current-repo-handler';

/**
 * @param {Router} app
 */
export default app => {
  const reposRoute = Router();
  app.use('/repos', reposRoute);

  reposRoute.get(
    '/',
    routeJSONHandler(() => Container.get('RepoService').getRepos())
  );

  const route = Router();
  reposRoute.use('/:repositoryId', currentRepoHandler(Container), route);

  route.get(
    '/commits/:commitHash*/diff',
    routeStreamHandler((req, res) =>
      Container.get('RepoService').diff(
        res.locals.repo,
        req.params.commitHash + req.params[0]
      )
    )
  );

  route.get(
    '/commits/:commitHash*',
    routeJSONHandler((req, res) => {
      let { from, count } = req.query;
      from = isNaN(from) || from < 1 ? 1 : +from;
      count = isNaN(count) || count < 1 ? undefined : +count;

      return Container.get('RepoService').commits(
        res.locals.repo,
        req.params.commitHash + req.params[0],
        from,
        count
      );
    })
  );

  route.get(
    '/',
    routeJSONHandler((req, res) =>
      Container.get('RepoService').tree(res.locals.repo)
    )
  );
  route.get(
    '/tree/*',
    routeJSONHandler((req, res) =>
      Container.get('RepoService').tree(res.locals.repo, req.params[0])
    )
  );

  route.get(
    '/blob/*',
    routeStreamHandler((req, res) => {
      Container.get('RepoService').blob(res.locals.repo, req.params[0]);
    })
  );

  route.delete('/', async (req, res, next) => {
    const Logger = Container.get('logger');
    try {
      await Container.get('RepoService').deleteRepo(res.locals.repo);
      res.status(200).end();
    } catch (err) {
      Logger.info(`Error on route ${req.method} ${req.url}: %o`, err);
      next(err);
    }
  });

  route.post('/', async (req, res, next) => {
    const Logger = Container.get('logger');
    try {
      const { url = '' } = req.body;
      await Container.get('RepoService').addRepo(res.locals.repoId, url);
      res.status(201).end();
    } catch (err) {
      Logger.info(`Error on route ${req.method} ${req.url}: %o`, err);
      next(err);
    }
  });

  route.get(
    '/countSymbols',
    routeJSONHandler((req, res) =>
      Container.get('RepoService').countSymbols(res.locals.repo)
    )
  );

  return route;
};

// Helpers

const routeJSONHandler = handler => async (req, res, next) => {
  const Logger = Container.get('logger');
  try {
    const result = await handler(req, res);
    res.json(result);
  } catch (err) {
    Logger.info(`Error on route ${req.method} ${req.url}: %o`, err);
    next(err);
  }
};

const routeStreamHandler = handler => async (req, res, next) => {
  const Logger = Container.get('logger');
  try {
    const task = await handler(req, res);
    task.stream.pipe(
      res,
      { end: false }
    );
    await task.done;
    res.end();
  } catch (err) {
    Logger.info(`Error on route ${req.method} ${req.url}: %o`, err);
    next(err);
  }
};
