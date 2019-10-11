import { matchPath } from 'react-router';
import { PAGES, Routes } from 'pages';
import { getFilesState } from 'server/dataSources/files';
import { getFileState } from './file';
import { Container } from 'typedi';

export async function getData(router) {
  if (!router) {
    throw new Error('Route is not defined');
  }

  const service = Container.get('RepoService');
  const repos = await service.getRepos();

  const data = { repos };

  let repo;
  const match = matchPath(router.url, '/:repoId');
  if (match) {
    repo = await service.getRepo(match.params.repoId);
    if (!repo) {
      return notFoundData(data);
    }

    const branches = await service.branches(repo);

    data.repo = {
      repoId: repo.repoId,
      branches,
    };
  }

  switch (router.route) {
    case Routes.FILES:
      return { ...data, ...(await getFilesState(repo, router)) };
    case Routes.FILE:
      return { ...data, ...(await getFileState(repo, router)) };
    case Routes.HOME:
    case Routes.NOT_FOUND:
      return data;
    default:
      throw new Error(`Cannot find data for route "${router.route}"`);
  }
}

export function notFoundData(router, data = {}) {
  return {
    router: matchPath(router.url, PAGES[Routes.NOT_FOUND]),
    ...data,
  };
}
