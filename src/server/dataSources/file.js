import { Container } from 'typedi';
import { notFoundData } from './';

export async function getFileState(repo, router) {
  const service = Container.get('RepoService');

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
