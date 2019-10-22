import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { currentRepoHandler } from 'server/api/middleware/current-repo-handler';
import RepoService, { RepoServiceStream } from 'server/services/repo';
import Logger from 'server/loaders/logger';

type Handler<T> = (req: Request, res: Response) => Promise<T>;
const routeJSONHandler = <T>(handler: Handler<T>) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Logger = Container.get<Logger>('logger');
  try {
    const result = await handler(req, res);
    res.json(result);
  } catch (err) {
    Logger.info(`Error on route ${req.method} ${req.url}: %o`, err);
    next(err);
  }
};

const routeStreamHandler = (handler: Handler<RepoServiceStream>) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Logger = Container.get<Logger>('logger');
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

export default (app: Router) => {
  const reposRoute = Router();
  app.use('/repos', reposRoute);

  reposRoute.get(
    '/',
    routeJSONHandler(() => Container.get<RepoService>('RepoService').getRepos())
  );

  const route = Router();
  reposRoute.use('/:repositoryId', currentRepoHandler(Container), route);

  route.get(
    '/commits/:commitHash*/diff',
    routeStreamHandler((req: Request, res: Response) =>
      Container.get<RepoService>('RepoService').diff(
        res.locals.repo,
        req.params.commitHash + req.params[0]
      )
    )
  );

  route.get(
    '/commits/:commitHash*',
    routeJSONHandler((req: Request, res: Response) => {
      let { from, count } = req.query;
      from = isNaN(from) || from < 1 ? 1 : +from;
      count = isNaN(count) || count < 1 ? undefined : +count;

      return Container.get<RepoService>('RepoService').commits(
        res.locals.repo,
        req.params.commitHash + req.params[0],
        from,
        count
      );
    })
  );

  route.get(
    '/',
    routeJSONHandler((_req: Request, res: Response) =>
      Container.get<RepoService>('RepoService').tree(res.locals.repo)
    )
  );
  route.get(
    '/tree/*',
    routeJSONHandler((req: Request, res: Response) =>
      Container.get<RepoService>('RepoService').tree(
        res.locals.repo,
        req.params[0]
      )
    )
  );

  route.get(
    '/blob/*',
    routeJSONHandler((req: Request, res: Response) =>
      Container.get<RepoService>('RepoService').blob(
        res.locals.repo,
        req.params[0]
      )
    )
  );

  route.get(
    '/branches',
    routeJSONHandler((_req: Request, res: Response) =>
      Container.get<RepoService>('RepoService').branches(res.locals.repo)
    )
  );

  route.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get<Logger>('logger');
    try {
      await Container.get<RepoService>('RepoService').deleteRepo(
        res.locals.repo
      );
      res.status(200).end();
    } catch (err) {
      logger.info(`Error on route ${req.method} ${req.url}: %o`, err);
      next(err);
    }
  });

  route.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get<Logger>('logger');
    try {
      const { url = '' } = req.body;
      await Container.get<RepoService>('RepoService').addRepo(
        res.locals.repoId,
        url
      );
      res.status(201).end();
    } catch (err) {
      logger.info(`Error on route ${req.method} ${req.url}: %o`, err);
      next(err);
    }
  });

  return route;
};
