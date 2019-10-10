import { Routes } from 'pages';
import { getFilesState } from 'server/dataSources/files';
import { getFileState } from './file';
import { Container } from 'typedi';

export async function getData(router) {
  if (!router) {
    throw new Error('Route is not defined');
  }

  switch (router.route) {
    case Routes.FILES:
      return getFilesState(router);
    case Routes.FILE:
      return getFileState(router);
    case Routes.HOME:
      return { repos: await Container.get('RepoService').getRepos() };
    default:
      throw new Error(`Cannot find data for route "${router.route}"`);
  }
}
