/* global describe, test, beforeEach, expect, jest */
import { Container } from 'typedi';

import RepoService from './repo';

describe('Repo service', () => {
  beforeEach(() => {
    Container.reset();
  });

  test('getRepos should get repo list from Repo model', async () => {
    const expectedRepos = ['repo1', 'repo2', 'repo3'];
    const RepoModel = {
      getRepoList: jest.fn().mockResolvedValue(expectedRepos),
    };
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());

    const repoService = new RepoService(Container);

    const repos = await repoService.getRepos();
    expect(repos).toEqual(expectedRepos);
    expect(RepoModel.getRepoList).toBeCalledTimes(1);
  });

  test('getRepos should caching repo list', async () => {
    const expectedRepos = ['repo1', 'repo2', 'repo3'];
    const RepoModel = {
      getRepoList: jest.fn().mockResolvedValue(expectedRepos),
    };
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());

    const repoService = new RepoService(Container);

    await repoService.getRepos();
    expect(RepoModel.getRepoList).toBeCalledTimes(1);

    const repos = await repoService.getRepos();
    expect(repos).toEqual(expectedRepos);
    expect(RepoModel.getRepoList).toBeCalledTimes(1);
  });

  test('getRepo should return existing repo from Repo model', async () => {
    const expectedRepos = ['repo1', 'repo2', 'repo3'];
    const expectedRepo = {};
    const RepoModel = {
      getRepoList: jest.fn().mockResolvedValue(expectedRepos),
      get: jest.fn().mockReturnValue(expectedRepo),
    };
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());

    const repoService = new RepoService(Container);

    const repo = await repoService.getRepo('repo2');
    expect(repo).toBe(expectedRepo);
    expect(RepoModel.get).toBeCalledTimes(1);
    expect(RepoModel.get).toBeCalledWith('repo2');
  });

  test('getRepo should return null if repo does not exist', async () => {
    const repos = ['repo1', 'repo2', 'repo3'];
    const RepoModel = {
      getRepoList: jest.fn().mockResolvedValue(repos),
      get: jest.fn(),
    };
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());

    const repoService = new RepoService(Container);

    const repo = await repoService.getRepo('repo42');
    expect(repo).toBeNull();
    expect(RepoModel.get).not.toBeCalled();
  });

  test('addRepo should add repo to Repo model', async () => {
    const RepoModel = {
      add: jest.fn(),
    };
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());

    const repoService = new RepoService(Container);

    const repoName = 'repo42';
    const url = 'git://https://github.com/name/repo.git';

    await repoService.addRepo(repoName, url);
    expect(RepoModel.add).toBeCalledWith(repoName, url);
  });

  test('addRepo should update cached list of repos', async () => {
    const repos = ['repo1', 'repo2', 'repo3'];
    const RepoModel = {
      getRepoList: jest.fn().mockResolvedValue(repos),
      add: jest.fn(),
    };
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());

    const repoService = new RepoService(Container);

    const repoName = 'repo42';
    const url = 'git://https://github.com/name/repo.git';

    const expectedRepos = [...repos];
    const reposBeforeAdd = await repoService.getRepos();
    expect(reposBeforeAdd).toEqual(expectedRepos);

    await repoService.addRepo(repoName, url);

    const reposAfterAdd = await repoService.getRepos();

    expectedRepos.push(repoName);
    expect(reposAfterAdd).toEqual(expectedRepos);

    expect(RepoModel.getRepoList).toBeCalledTimes(1);
  });

  test('deleteRepo should delete repo from Repo model', async () => {
    const RepoModel = {
      delete: jest.fn(),
    };
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());

    const repoService = new RepoService(Container);

    const repo = { repoId: 'repo42' };

    await repoService.deleteRepo(repo);
    expect(RepoModel.delete).toBeCalledWith(repo);
  });

  test('deleteRepo should update cached list of repos', async () => {
    const repos = ['repo1', 'repo42', 'repo3'];
    const RepoModel = {
      getRepoList: jest.fn().mockResolvedValue(repos),
      delete: jest.fn(),
    };
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());

    const repoService = new RepoService(Container);

    const repo = { repoId: 'repo42' };

    const expectedRepos = [...repos];
    const reposBeforeDelete = await repoService.getRepos();
    expect(reposBeforeDelete).toEqual(expectedRepos);

    await repoService.deleteRepo(repo);

    const reposAfterDelete = await repoService.getRepos();

    expectedRepos.splice(1, 1);
    expect(reposAfterDelete).toEqual(expectedRepos);

    expect(RepoModel.getRepoList).toBeCalledTimes(1);
  });

  test('commits should return list of commits from Repo', async () => {
    const RepoModel = {};
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());
    const repoService = new RepoService(Container);

    const repo = {
      revList: jest
        .fn()
        .mockReturnValue({ getOutput: () => Promise.resolve('2') }),
      log: jest.fn().mockReturnValue({
        getOutput: () =>
          Promise.resolve(`
abcd\t12-12-12 12:12\tauthor\tmy changes
dcba\t12-12-21 12:12\tauthor\tchanges`),
      }),
    };
    const expected = {
      commits: [
        {
          hash: 'abcd',
          date: '12-12-12 12:12',
          author: 'author',
          subject: 'my changes',
        },
        {
          hash: 'dcba',
          date: '12-12-21 12:12',
          author: 'author',
          subject: 'changes',
        },
      ],
      total: 2,
    };
    const commitHash = 'hash42';
    const commits = await repoService.commits(repo, commitHash, 1, 10);
    expect(commits).toEqual(expected);
    expect(repo.revList.mock.calls[0][0]).toContain(commitHash);
    expect(repo.log.mock.calls[0][0]).toContain(commitHash);
  });

  test('commits should limit max number of returned commits', async () => {
    const RepoModel = {};
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());
    const repoService = new RepoService(Container);

    const repo = {
      revList: jest
        .fn()
        .mockReturnValue({ getOutput: () => Promise.resolve('2') }),
      log: jest.fn().mockReturnValue({
        getOutput: () =>
          Promise.resolve(`
abcd00\t12-12-12 12:12\tauthor\tmy changes
dcba01\t12-12-21 12:12\tauthor\tchanges1
`),
      }),
    };
    await repoService.commits(repo, 'hash42', 1, 12);
    expect(repo.log.mock.calls[0][0]).toContain('--max-count=10');
  });

  test('branches should return list of branches', async () => {
    const RepoModel = {};
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());
    const repoService = new RepoService(Container);

    const repo = {
      branch: jest.fn().mockReturnValue({
        getOutput: () =>
          Promise.resolve(`
* master
fix/another-branch
`),
      }),
    };
    const expectedBranches = [
      { name: 'master', active: true },
      { name: 'fix/another-branch', active: false },
    ];
    const branches = await repoService.branches(repo);
    expect(branches).toEqual(expectedBranches);
  });

  test('branches should determine active branch', async () => {
    const RepoModel = {};
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());
    const repoService = new RepoService(Container);

    const repo = {
      branch: jest.fn().mockReturnValue({
        getOutput: () =>
          Promise.resolve(`
master
* fix/another-branch
fix/another-fix
`),
      }),
    };
    const expectedBranches = [
      { name: 'master', active: false },
      { name: 'fix/another-branch', active: true },
      { name: 'fix/another-fix', active: false },
    ];
    const branches = await repoService.branches(repo);
    expect(branches).toEqual(expectedBranches);
  });

  test('tree should return sorted content of path and last commit', async () => {
    const RepoModel = {};
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());
    const repoService = new RepoService(Container);

    const branch = 'master';
    const path = 'src';
    const lastCommit = { subject: 'Last commit' };
    const fileInfo = { subject: 'init' };
    repoService.fileInfo = jest
      .fn()
      .mockImplementation((repo, branch, localPath) => {
        if (path === localPath) {
          return Promise.resolve(lastCommit);
        }
        return fileInfo;
      });

    const repo = {
      branch: jest.fn().mockReturnValue({
        getOutput: () =>
          Promise.resolve(`
master
* fix/another-branch
fix/another-fix
`),
      }),
      tree: jest.fn().mockReturnValue({
        getOutput: () =>
          Promise.resolve(`
100644 blob ae10a5cce3b26a0832879cd7d3682cee8824d1fb\t.editorconfig
100644 blob 53c37a16608c014b2cf0bd2d5dfcafe953cdd857\t.eslintignore
040000 tree 3a3172dbed888b6dc90529c852e5082582386ea3\tconfig
100644 blob f614446edf93cbad526ba78952901da972525005\tindex.js
`),
      }),
    };

    const expectedTree = {
      branch,
      path,
      lastCommit,
      files: [
        {
          filename: 'config',
          type: 'tree',
          ...fileInfo,
        },
        {
          filename: '.editorconfig',
          type: 'blob',
          ...fileInfo,
        },
        {
          filename: '.eslintignore',
          type: 'blob',
          ...fileInfo,
        },
        {
          filename: 'index.js',
          type: 'blob',
          ...fileInfo,
        },
      ],
    };
    const tree = await repoService.tree(repo, `${branch}/${path}`);
    expect(tree).toEqual(expectedTree);
    expect(repoService.fileInfo).toBeCalledTimes(expectedTree.files.length + 1);
    expect(repo.tree).toBeCalledWith([`${branch}:${path}`]);
  });

  test('tree should return correct result for branches with /', async () => {
    const RepoModel = {};
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());
    const repoService = new RepoService(Container);

    const branch = 'fix/another-fix';
    const path = 'src/components';
    const lastCommit = { subject: 'Last commit' };
    const fileInfo = { subject: 'init' };
    repoService.fileInfo = jest
      .fn()
      .mockImplementation((repo, branch, localPath) => {
        if (path === localPath) {
          return Promise.resolve(lastCommit);
        }
        return fileInfo;
      });

    const repo = {
      branch: jest.fn().mockReturnValue({
        getOutput: () =>
          Promise.resolve(`
master
* fix/another-branch
fix/another-fix
`),
      }),
      tree: jest.fn().mockReturnValue({
        getOutput: () =>
          Promise.resolve(`
100644 blob ae10a5cce3b26a0832879cd7d3682cee8824d1fb\t.editorconfig
100644 blob 53c37a16608c014b2cf0bd2d5dfcafe953cdd857\t.eslintignore
040000 tree 3a3172dbed888b6dc90529c852e5082582386ea3\tconfig
100644 blob f614446edf93cbad526ba78952901da972525005\tindex.js
`),
      }),
    };

    const expectedTree = {
      branch,
      path,
      lastCommit,
      files: [
        {
          filename: 'config',
          type: 'tree',
          ...fileInfo,
        },
        {
          filename: '.editorconfig',
          type: 'blob',
          ...fileInfo,
        },
        {
          filename: '.eslintignore',
          type: 'blob',
          ...fileInfo,
        },
        {
          filename: 'index.js',
          type: 'blob',
          ...fileInfo,
        },
      ],
    };
    const tree = await repoService.tree(repo, `${branch}/${path}`);
    expect(tree).toEqual(expectedTree);
    expect(repo.tree).toBeCalledWith([`${branch}:${path}`]);
  });

  test('tree without path should return root content of active branch', async () => {
    const RepoModel = {};
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());
    const repoService = new RepoService(Container);

    const activeBranch = 'fix/another-branch';
    const path = '';
    const lastCommit = { subject: 'Last commit' };
    const fileInfo = { subject: 'init' };
    repoService.fileInfo = jest
      .fn()
      .mockImplementation((repo, branch, localPath) => {
        if (path === localPath) {
          return Promise.resolve(lastCommit);
        }
        return fileInfo;
      });

    const repo = {
      branch: jest.fn().mockReturnValue({
        getOutput: () =>
          Promise.resolve(`
master
* fix/another-branch
fix/another-fix
`),
      }),
      tree: jest.fn().mockReturnValue({
        getOutput: () =>
          Promise.resolve(`
100644 blob ae10a5cce3b26a0832879cd7d3682cee8824d1fb\t.editorconfig
100644 blob 53c37a16608c014b2cf0bd2d5dfcafe953cdd857\t.eslintignore
040000 tree 3a3172dbed888b6dc90529c852e5082582386ea3\tconfig
100644 blob f614446edf93cbad526ba78952901da972525005\tindex.js
`),
      }),
    };

    const expectedTree = {
      branch: activeBranch,
      path,
      lastCommit,
      files: [
        {
          filename: 'config',
          type: 'tree',
          ...fileInfo,
        },
        {
          filename: '.editorconfig',
          type: 'blob',
          ...fileInfo,
        },
        {
          filename: '.eslintignore',
          type: 'blob',
          ...fileInfo,
        },
        {
          filename: 'index.js',
          type: 'blob',
          ...fileInfo,
        },
      ],
    };
    const tree = await repoService.tree(repo);
    expect(tree).toEqual(expectedTree);
    expect(repo.tree).toBeCalledWith([`${activeBranch}:${path}`]);
  });

  test('blob should return file content and last commit', async () => {
    const RepoModel = {};
    Container.set('RepoModel', RepoModel);
    Container.set('logger', mockLogger());
    const repoService = new RepoService(Container);

    const branch = 'master';
    const path = 'src/index.js';
    const lastCommit = { subject: 'Last commit' };
    const fileContent = `
    Line one
    
    Line after black line
    End`;
    repoService.fileInfo = jest.fn().mockResolvedValue(lastCommit);

    const repo = {
      branch: jest.fn().mockReturnValue({
        getOutput: () =>
          Promise.resolve(`
master
* fix/another-branch
fix/another-fix
`),
      }),
      show: jest.fn().mockReturnValue({
        getOutput: () => Promise.resolve(fileContent),
      }),
    };

    const expectedFile = {
      branch,
      path,
      lastCommit,
      file: fileContent,
    };
    const file = await repoService.blob(repo, `${branch}/${path}`);
    expect(file).toEqual(expectedFile);
    expect(repoService.fileInfo).toBeCalledTimes(1);
    expect(repo.show).toBeCalledWith([`${branch}:${path}`]);
  });
});

function mockLogger() {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}
