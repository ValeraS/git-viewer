import { Routes } from 'pages';
import { getFilesState } from 'server/dataSources/files';

export async function getData(router) {
  if (!router) {
    throw new Error('Route is not defined');
  }

  switch (router.route) {
    case Routes.FILES:
      return getFilesState(router);
    case Routes.HOME:
      return {};
    default:
      throw new Error(`Cannot find data for route "${router.route}"`);
  }
}
