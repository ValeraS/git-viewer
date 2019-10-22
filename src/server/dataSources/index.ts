import { matchPath } from 'react-router';
import { PAGES, Routes } from 'pages';
import { getFilesState } from 'server/dataSources/files';
import { getFileState } from './file';
import { Container } from 'typedi';
import { RouterState, RouterEvent } from 'app-store/router/types';
import RepoService from 'server/services/repo';
import { Repo } from 'server/models/repo';
import { AppState } from 'app-store';

export function notFoundData(router: RouterEvent, data = {}) {
  return {
    router: matchPath(router.url, PAGES[Routes.NOT_FOUND]),
    ...data,
  };
}

export async function getData(router: RouterState) {
  if (!router) {
    throw new Error('Route is not defined');
  }

  const service = Container.get<RepoService>('RepoService');
  const repos = await service.getRepos();

  const data: Partial<AppState> = { repos };

  if (router.route === Routes.HOME || router.route === Routes.NOT_FOUND) {
    return data;
  }

  let repo: Repo | null;
  const match = matchPath<{ repoId: string }>(router.url, '/:repoId');
  if (match) {
    repo = await service.getRepo(match.params.repoId);
    if (!repo) {
      return notFoundData(router, data);
    }

    const branches = await service.branches(repo);

    data.repo = {
      repoId: repo.repoId,
      branches,
    };

    switch (router.route) {
      case Routes.FILES:
        return { ...data, ...(await getFilesState(repo, router)) };
      case Routes.FILE:
        return { ...data, ...(await getFileState(repo, router)) };
      default:
        throw new Error(`Cannot find data for route "${router.route}"`);
    }
  }
  throw new Error(`Cannot find data for route "${router.route}"`);
}
