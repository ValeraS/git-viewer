import path from 'path';
import fs from 'fs';
import util from 'util';
import Container from 'typedi';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import rimrafNode from 'rimraf';
import Logger from 'server/loaders/logger';

type Process = {
  spawn: typeof spawn;
};

const rimraf = util.promisify(rimrafNode);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

export class Repo {
  private _repoId: string;
  private _gitRunner: GitRunner;
  private _logger: Logger;

  constructor(
    container: typeof Container,
    repoId: string,
    gitRunner: GitRunner
  ) {
    this._repoId = repoId;
    this._gitRunner = gitRunner;
    this._logger = container.get('logger');
  }

  get repoId() {
    return this._repoId;
  }

  log(options?: string[]) {
    return this._run('log', options);
  }

  diff(options?: string[]) {
    return this._run('diff', options);
  }

  revList(options?: string[]) {
    return this._run('rev-list', options);
  }

  tree(options?: string[]) {
    return this._run('ls-tree', options);
  }

  show(options?: string[]) {
    return this._run('show', options);
  }

  grep(options?: string[]) {
    return this._run('grep', options);
  }

  branch(options?: string[]) {
    return this._run('branch', options);
  }

  private _run(command: string, options?: string[], opts: GitOptions = {}) {
    const cmd = [command];
    if (Array.isArray(options)) {
      cmd.push(...options);
    }
    this._logger.info({ cmd, opts });
    return this._gitRunner.run(cmd, opts);
  }
}

type GitProcess = {
  process: ChildProcessWithoutNullStreams;
  done: Promise<void>;
};

type GitDoneCallback = (err?: string) => void;
type GitOnErrorCallback = (
  exitCode: number,
  err: string,
  c: GitDoneCallback
) => void;
type GitOptions = {
  onError?: GitOnErrorCallback;
};
type GitTaskCallback = (value: GitProcess | PromiseLike<GitProcess>) => void;
type GitTask = [string[], GitOptions, GitTaskCallback];
type GitTaskResult = Promise<GitProcess> & {
  getOutput: () => Promise<string>;
};

export class GitRunner {
  private _baseDir: string;
  private _runQueue: GitTask[];
  private _logger: Logger;
  private _childProcess: Process;
  private _spawned?: ChildProcessWithoutNullStreams;
  private _env = {};
  private _command = 'git';
  constructor(container: typeof Container, baseDir: string) {
    this._baseDir = baseDir;
    this._runQueue = [];
    this._logger = container.get('logger');
    this._childProcess = container.get('ChildProcess');
  }

  run(command: string[], opts: GitOptions = {}) {
    const result = deferred<GitProcess>();
    this._runQueue.push([command, opts, result.resolve]);
    this._schedule();
    const deferredTask: GitTaskResult = result.done as GitTaskResult;
    deferredTask.getOutput = () => this._getOutput(deferredTask);
    return deferredTask;
  }

  private async _getOutput(deferredTask: Promise<GitProcess>) {
    const task = await deferredTask;
    const stdOut: Buffer[] = [];
    task.process.stdout.on('data', buffer => stdOut.push(buffer));
    await task.done;
    return Buffer.concat(stdOut).toString('utf-8');
  }

  private _schedule() {
    if (!!this._spawned || this._runQueue.length === 0) {
      return;
    }

    const task = this._runQueue.shift();
    if (!task) {
      return;
    }
    const [command, opts, callback] = task;

    const spawned = (this._spawned = this._childProcess.spawn(
      this._command,
      command.slice(0),
      {
        cwd: this._baseDir,
        env: this._env,
        windowsHide: true,
      }
    ));

    const processResult = deferred<number>();

    const stdErr: Buffer[] = [];
    spawned.on('error', err => {
      stdErr.push(Buffer.from(err.stack || '', 'ascii'));
    });

    spawned.stderr.on('data', (buffer: Buffer) => {
      stdErr.push(buffer);
    });

    const onFinish = (exitCode: number) => {
      processResult.resolve(exitCode);
    };
    spawned.on('close', onFinish);
    spawned.on('exit', onFinish);

    const resultPromise = processResult.done.then(async exitCode => {
      const result = deferred<void>();
      const done = (err?: string) => {
        if (err) {
          this._fail(err);
          result.reject(new Error(err));
        }
        result.resolve();
      };

      if (exitCode && opts.onError) {
        opts.onError(exitCode, Buffer.concat(stdErr).toString('utf-8'), done);
      } else if (exitCode) {
        done(Buffer.concat(stdErr).toString('utf-8'));
      } else {
        done();
      }

      delete this._spawned;

      process.nextTick(this._schedule.bind(this));
      return result.done;
    });

    const result: GitProcess = { process: spawned, done: resultPromise };

    callback(result);
  }

  private _fail(err: string) {
    this._logger.info('Error on run git command', err);
    this._runQueue.length = 0;
  }
}

export class RepoModel {
  private _pathToRepos: string;
  private _repoFactory: (id: string, git: GitRunner) => Repo;
  private _gitRunnerFactory: (path: string) => GitRunner;

  constructor(pathToRepos: string, container: typeof Container) {
    this._pathToRepos = pathToRepos;
    this._repoFactory = container.get('Repo');
    this._gitRunnerFactory = container.get('GitRunner');
  }

  get MAGIC_GIT_FIRST_PARENT() {
    return '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
  }

  get(repoId: string) {
    const runner = this._gitRunnerFactory(
      path.resolve(this._pathToRepos, repoId)
    );
    return this._repoFactory(repoId, runner);
  }

  add(repoId: string, url: string) {
    const runner = this._gitRunnerFactory(this._pathToRepos);
    return runner.run(['clone', url, repoId]).getOutput();
  }

  delete(repo: Repo) {
    const pathToRepo = path.resolve(this._pathToRepos, repo.repoId);
    return rimraf(pathToRepo);
  }

  async getRepoList() {
    const fileNames = await readdir(this._pathToRepos);
    const dirs = (await Promise.all(
      fileNames.map(async filename => ({
        filename,
        stat: await stat(path.resolve(this._pathToRepos, filename)),
      }))
    )).reduce(
      (dirs, fileStat) => {
        if (fileStat.stat.isDirectory()) {
          dirs.push(fileStat.filename);
        }
        return dirs;
      },
      [] as string[]
    );
    return dirs;
  }
}

type Deferred<T> = {
  done: Promise<T>;
  resolve: (v?: T | PromiseLike<T>) => void;
  reject: (r: unknown) => void;
};

function deferred<T>() {
  const d: Deferred<T> = {} as Deferred<T>;
  d.done = new Promise<T>((resolve, reject) => {
    d.resolve = resolve;
    d.reject = reject;
  });
  return d;
}
