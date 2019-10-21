import Container from 'typedi';
import Logger from 'server/loaders/logger';
import { RepoModel, Repo } from 'server/models/repo';
import { Readable } from 'stream';

type Commit = {
  hash: string;
  date: string;
  author: string;
  subject: string;
};

type File = {
  type: string;
  filename: string;
};

export type RepoServiceStream = {
  stream: Readable;
  done: Promise<void>;
};

export default class RepoService {
  private _repoList?: string[];
  private _logger: Logger;
  private _repoModel: RepoModel;

  constructor(container: typeof Container) {
    this._logger = container.get('logger');
    this._repoModel = container.get('RepoModel');
  }

  getRepos() {
    return this._getRepos();
  }

  async getRepo(repoId: string) {
    if (!(await this._repoExists(repoId))) {
      return null;
    }
    return this._repoModel.get(repoId);
  }

  async commits(repo: Repo, commitHash: string, from = 1, count?: number) {
    const commitCount = parseInt(
      await repo.revList([commitHash, '--count']).getOutput(),
      10
    );
    const maxCount = 10;
    const commits = await repo
      .log([
        commitHash,
        `--skip=${from - 1}`,
        `--max-count=${Math.min(count || maxCount, maxCount)}`,
        '--format=%H\t%aI\t%an\t%s',
      ])
      .getOutput();

    return {
      total: commitCount,
      commits: commits.split('\n').reduce(
        (commits, el) => {
          if (el) {
            const [hash, date, author, subject] = el.split('\t');
            commits.push({
              hash,
              date,
              author,
              subject,
            });
          }
          return commits;
        },
        [] as Commit[]
      ),
    };
  }

  async diff(repo: Repo, commitHash: string): Promise<RepoServiceStream> {
    const parents = await repo
      .log(['-1', '--format=%P', commitHash])
      .getOutput();
    this._logger.info(parents);
    const firstParent = /^\s*$/.test(parents)
      ? this._repoModel.MAGIC_GIT_FIRST_PARENT
      : parents.split(/\s+/)[0];
    const task = await repo.diff([`${firstParent}..${commitHash}`]);
    return {
      done: task.done,
      stream: task.process.stdout,
    };
  }

  async branches(repo: Repo) {
    const branches = (await repo.branch().getOutput())
      .trim()
      .split('\n')
      .map(name => {
        if (name.startsWith('*')) {
          return {
            active: true,
            name: name.substr(1).trim(),
          };
        }
        return {
          active: false,
          name: name.trim(),
        };
      });
    return branches;
  }

  async tree(repo: Repo, urlPath = '') {
    const branch = await this._getBranchFromUrl(repo, urlPath);
    if (!branch) {
      return null;
    }
    const path = urlPath.substr(branch.length + 1);

    const out = await repo.tree([`${branch}:${path}`]).getOutput();
    const files = out
      .split('\n')
      .reduce(
        (records, el) => {
          if (!el) {
            return records;
          }
          const [metadata, filename] = el.split('\t');
          const [, type] = metadata.split(/\s+/);
          records.push({
            filename,
            type,
          });
          return records;
        },
        [] as File[]
      )
      .sort((a, b) => {
        if (a.type === b.type) {
          return a.filename < b.filename
            ? -1
            : a.filename === b.filename
            ? 0
            : 1;
        }
        return a.type === 'tree' ? -1 : 1;
      });

    let pathPrefix = path;
    if (pathPrefix && !pathPrefix.endsWith('/')) {
      pathPrefix = pathPrefix + '/';
    }
    const lastCommit = await this.fileInfo(repo, branch, path);
    const filesInfo = await Promise.all(
      files.map(async ({ filename, ...other }) => {
        const info = await this.fileInfo(
          repo,
          branch,
          `${pathPrefix}${filename}`
        );
        return { ...other, ...info, filename };
      })
    );

    return {
      branch,
      path,
      lastCommit,
      files: filesInfo,
    };
  }

  async fileInfo(repo: Repo, commitHash: string, path: string) {
    const commands = [commitHash, '-1', '--format=%H%n%cN%n%cI%n%cr%n%s', '--'];
    if (path) {
      commands.push(path);
    }
    const [hash, committer, date, relativeDate, subject] = (await repo
      .log(commands)
      .getOutput()).split('\n');
    return { hash, committer, date, relativeDate, subject };
  }

  async blob(repo: Repo, urlPath: string) {
    const branch = await this._getBranchFromUrl(repo, urlPath);
    if (!branch) {
      return null;
    }

    const path = urlPath.substr(branch.length + 1);

    const lastCommit = await this.fileInfo(repo, branch, path);
    const file = await repo.show([`${branch}:${path}`]).getOutput();
    return {
      branch,
      path,
      lastCommit,
      file,
    };
  }

  async addRepo(repoId: string, repoUrl: string) {
    const href = repoUrl.replace(/^https?(?=:\/\/)/, 'git');
    this._logger.info(href);
    await this._repoModel.add(repoId, href);
    if (this._repoList) {
      this._repoList.push(repoId);
    }
  }

  deleteRepo(repo: Repo) {
    if (this._repoList) {
      this._repoList = this._repoList.filter(el => el !== repo.repoId);
    }
    return this._repoModel.delete(repo);
  }

  async _repoExists(repoId: string) {
    return (await this._getRepos()).includes(repoId);
  }

  async _getRepos() {
    if (!this._repoList) {
      try {
        this._repoList = await this._repoModel.getRepoList();
      } catch (err) {
        this._logger.error('Error on getRepos: %o', err);
        throw err;
      }
    }
    return this._repoList;
  }

  async _getBranchFromUrl(repo: Repo, url: string) {
    const branches = await this.branches(repo);
    if (url) {
      for (const { name } of branches) {
        if (url.startsWith(name + '/') || url === name) {
          return name;
        }
      }
    }
    const activeBranch = branches.find(({ active }) => active);
    if (activeBranch) {
      return activeBranch.name;
    }
    throw new Error('No active branch');
  }
}
