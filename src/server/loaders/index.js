import expressLoader from 'server/loaders/express';
import dependencyInjectorLoader from 'server/loaders/dependency-injector';
import { info } from 'server/loaders/logger';

export default async ({ app, ...args }) => {
  await dependencyInjectorLoader(args);
  info('Dependency Injector loaded');

  await expressLoader({ app });
  info('Express loaded');
};
