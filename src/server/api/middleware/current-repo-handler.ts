import Container from 'typedi';
import Logger from 'server/loaders/logger';
import RepoService from 'server/services/repo';
import { Request, Response, NextFunction } from 'express';

export function currentRepoHandler(container: typeof Container) {
  return async function(req: Request, res: Response, next: NextFunction) {
    const logger = container.get<Logger>('logger');
    try {
      const service = container.get<RepoService>('RepoService');
      const repoId = req.params.repositoryId;
      const repo = await service.getRepo(repoId);
      if (req.method === 'POST' && !req.params[0]) {
        // add repo request
        if (repo) {
          logger.info(`Repo ${repoId} exists`);
          return res
            .status(400)
            .json({ errors: { message: `Repo ${repoId} exists` } });
        }
      } else if (!repo) {
        logger.info(`Repo ${repoId} does not exist`);
        return res
          .status(404)
          .json({ errors: { message: `Repo ${repoId} does not exist` } });
      }
      res.locals.repo = repo;
      res.locals.repoId = repoId;
      return next();
    } catch (err) {
      logger.error(err);
      return next(err);
    }
  };
}
