import { Container } from 'typedi';
import { PAGES, Routes } from 'pages';

export async function getFilesState(router) {
  const service = Container.get('RepoService');
  const repos = await service.getRepos();
  const repo = await service.getRepo(router.params.repoId);
  if (!repo) {
    return notFoundData({ repos });
  }

  const branches = await service.branches(repo);

  const repoData = {
    repoId: repo.repoId,
    branches,
  };

  const tree = await service.tree(repo, router.params.path);
  if (!tree) {
    return notFoundData({ repos, repo: repoData });
  }

  return {
    repos,
    repo: repoData,
    pageData: {
      url: router.url,
      data: tree,
    },
  };
}

export function notFoundData(data = {}) {
  return {
    router: PAGES[Routes.NOT_FOUND],
    ...data,
  };
}
