import Container from 'typedi';
import Logger from 'server/loaders/logger';
import RepoService from 'server/services/repo';
import { RepoModel, Repo, GitRunner } from 'server/models/repo';
import * as ChildProcess from 'child_process';

function containerWrapper<T, S>(
  classFunction: new (c: typeof Container, ...args: S[]) => T,
  container: typeof Container
) {
  return (...args: S[]) => new classFunction(container, ...args);
}

export default ({ pathToRepos }: { pathToRepos: string }) => {
  try {
    Container.set('logger', Logger);
    Container.set('ChildProcess', ChildProcess);
    Container.set('GitRunner', containerWrapper(GitRunner, Container));
    Container.set('Repo', containerWrapper(Repo, Container));
    Container.set('RepoModel', new RepoModel(pathToRepos, Container));
    Container.set('RepoService', new RepoService(Container));
  } catch (err) {
    Logger.error('Error on dependency injector loader: %o', err);
    throw err;
  }
};
