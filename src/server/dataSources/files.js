import { Container } from 'typedi';
import { notFoundData } from './';

export async function getFilesState(repo, router) {
  const service = Container.get('RepoService');

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
