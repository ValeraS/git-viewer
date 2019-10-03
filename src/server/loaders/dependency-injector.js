import { Container } from 'typedi';
import Logger, { error } from 'server/loaders/logger';
import RepoService from 'server/services/repo';
import { RepoModel, Repo, GitRunner } from 'server/models/repo';

function containerWrapper(classFunction, container) {
  return (...args) => new classFunction(...args, container);
}

export default ({ pathToRepos }) => {
  try {
    Container.set('logger', Logger);
    Container.set('ChildProcess', require('child_process'));
    Container.set('GitRunner', containerWrapper(GitRunner, Container));
    Container.set('Repo', containerWrapper(Repo, Container));
    Container.set('RepoModel', new RepoModel(pathToRepos, Container));
    Container.set('RepoService', new RepoService(Container));
  } catch (err) {
    error('Error on dependency injector loader: %o', err);
    throw err;
  }
};
