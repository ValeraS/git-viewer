export default function RepoService(container) {
  this._logger = container.get('logger');
  this._repoModel = container.get('RepoModel');
}

RepoService.prototype.getRepos = async function() {
  return this._getRepos();
};

RepoService.prototype.getRepo = async function(repoId) {
  if (!(await this._repoExists(repoId))) {
    return null;
  }
  return this._repoModel.get(repoId);
};

RepoService.prototype.commits = async function(repo, commitHash, from, count) {
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
    commits: commits.split('\n').reduce((commits, el) => {
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
    }, []),
  };
};

RepoService.prototype.diff = async function(repo, commitHash) {
  const parents = await repo.log(['-1', '--format=%P', commitHash]).getOutput();
  this._logger.info(parents);
  const firstParent = /^\s*$/.test(parents)
    ? this._repoModel.MAGIC_GIT_FIRST_PARENT
    : parents.split(/\s+/)[0];
  const task = await repo.diff([`${firstParent}..${commitHash}`]);
  return {
    done: task.done,
    stream: task.process.stdout,
  };
};

RepoService.prototype.branches = async function(repo) {
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
};

RepoService.prototype.tree = async function(repo, urlPath = '') {
  const branch = await this._getBranchFromUrl(repo, urlPath);
  if (!branch) {
    return null;
  }
  const path = urlPath.substr(branch.length + 1);

  const out = await repo.tree([`${branch}:${path}`]).getOutput();
  const files = out
    .split('\n')
    .reduce((records, el) => {
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
    }, [])
    .sort((a, b) => {
      if (a.type === b.type) {
        return a.filename < b.filename ? -1 : a.filename === b.filename ? 0 : 1;
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
};

RepoService.prototype.fileInfo = async function(repo, commitHash, path) {
  const commands = [commitHash, '-1', '--format=%H%n%cN%n%cI%n%cr%n%s', '--'];
  if (path) {
    commands.push(path);
  }
  const [hash, committer, date, relativeDate, subject] = (await repo
    .log(commands)
    .getOutput()).split('\n');
  return { hash, committer, date, relativeDate, subject };
};

RepoService.prototype.blob = async function(repo, urlPath) {
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
};

RepoService.prototype.countSymbols = async function(repo) {
  const task = await repo.grep([
    '-I', // Do not match in binary
    '-o', // Show only matches
    '-h', // Do not show filename
    '\\S', // Match any not white-space symbols
  ]);

  const symbols = new Map();
  task.process.stdout.on('data', buffer => {
    buffer
      .toString('utf-8')
      .replace(/\s+/g, '')
      .split('')
      .forEach(symbol => {
        let count = 0;
        if (symbols.has(symbol)) {
          count = symbols.get(symbol);
        }
        count++;
        symbols.set(symbol, count);
      });
  });
  await task.done;
  return mapToObject(symbols);
};

function mapToObject(strMap) {
  const obj = Object.create(null);
  for (const [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

RepoService.prototype.addRepo = async function(repoId, repoUrl) {
  const href = repoUrl.replace(/^https?(?=:\/\/)/, 'git');
  this._logger.info(href);
  await this._repoModel.add(repoId, href);
  if (this._repoList) {
    this._repoList.push(repoId);
  }
};

RepoService.prototype.deleteRepo = async function(repo) {
  if (this._repoList) {
    this._repoList = this._repoList.filter(el => el !== repo.repoId);
  }
  await this._repoModel.delete(repo);
};

RepoService.prototype._repoExists = async function(repoId) {
  return (await this._getRepos()).includes(repoId);
};

RepoService.prototype._getRepos = async function() {
  if (!this._repoList) {
    try {
      this._repoList = await this._repoModel.getRepoList();
    } catch (err) {
      this._logger.error('Error on getRepos: %o', err);
      throw err;
    }
  }
  return this._repoList;
};

RepoService.prototype._getBranchFromUrl = async function(repo, url) {
  const branches = await this.branches(repo);
  if (url) {
    for (let { name } of branches) {
      if (url.startsWith(name + '/') || url === name) {
        return name;
      }
    }
  }
  return branches.find(({ active }) => active).name;
};
