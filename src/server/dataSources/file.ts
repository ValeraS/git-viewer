import Container from 'typedi';
import { notFoundData } from './';
import RepoService from 'server/services/repo';
import { RouterEvent } from 'app-store/router/types';
import { Repo } from 'server/models/repo';

export async function getFileState(repo: Repo, router: RouterEvent) {
  if (!router.params.path) {
    throw new Error('Path to file should be provided');
  }

  const service = Container.get<RepoService>('RepoService');

  const blob = await service.blob(repo, router.params.path);
  if (!blob) {
    return notFoundData(router);
  }

  return {
    pageData: {
      url: router.url,
      data: blob,
    },
  };
}
