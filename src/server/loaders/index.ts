import { Express } from 'express';
import expressLoader from 'server/loaders/express';
import dependencyInjectorLoader from 'server/loaders/dependency-injector';
import { info } from 'server/loaders/logger';

export default ({
  app,
  pathToRepos,
}: {
  app: Express;
  pathToRepos: string;
}) => {
  dependencyInjectorLoader({ pathToRepos });
  info('Dependency Injector loaded');

  expressLoader({ app });
  info('Express loaded');
};
