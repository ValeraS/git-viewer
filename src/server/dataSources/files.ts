import Container from 'typedi';
import { notFoundData } from 'server/dataSources';
import { Repo } from 'server/models/repo';
import { RouterEvent } from 'app-store/router/types';
import RepoService from 'server/services/repo';

export async function getFilesState(repo: Repo, router: RouterEvent) {
  const service = Container.get<RepoService>('RepoService');

  const tree = await service.tree(repo, router.params.path);
  if (!tree) {
    return notFoundData(router);
  }

  return {
    pageData: {
      url: router.url,
      data: tree,
    },
  };
}
