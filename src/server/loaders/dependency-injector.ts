import Container from 'typedi';
import Logger from 'server/loaders/logger';
import RepoService from 'server/services/repo';
import { RepoModel, Repo, GitRunner } from 'server/models/repo';
import * as ChildProcess from 'child_process';

type ConstructorWithNoParams<T> = {
  new (c: typeof Container): T;
};
type ConstructorWithOneParams<T, U> = {
  new (c: typeof Container, arg1: U): T;
};
type ConstructorWithTwoParams<T, U, V> = {
  new (c: typeof Container, arg1: U, arg2: V): T;
};

type Constructor<T, U, V> =
  // | ConstructorWithNoParams<T>
  // | ConstructorWithOneParams<T, U>
   ConstructorWithTwoParams<T, U, V>;

type RestParamTypes<T, V> = T extends {
  new (c: typeof Container, ...args: infer U): V;
}
  ? U
  : never;

function containerWrapper<T, U, V, S extends Constructor<T, U, V>>(
  classFunction: S,
  container: typeof Container
) {
  return (...args: RestParamTypes<S, T>) => new classFunction(container, ...args);
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
