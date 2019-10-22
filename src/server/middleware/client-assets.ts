import { readFile } from 'fs';
import { join } from 'path';
import { getRoute } from 'app-store/selectors/getRoute';
import { Routes } from 'pages';
import { Request, Response, NextFunction } from 'express';

const DEFAULT_CSS = 'main.css';
const DEFAULT_JS = 'main.js';

type Manifest = Record<string, string>;

function readManifest(): Promise<Manifest> {
  return new Promise((resolve, reject) => {
    readFile(
      join(__dirname, 'asset-manifest.json'),
      { encoding: 'utf8' },
      (err, data) => {
        if (err) {
          reject(new Error('Client assets not ready'));
        } else {
          try {
            resolve(JSON.parse(data).files);
          } catch (err) {
            reject(new Error('Cannot parse client assets manifest'));
          }
        }
      }
    );
  });
}

function getFilesForRoute(
  files: Manifest,
  route: Routes,
  ext: string,
  fixedFiles: string[] = []
) {
  const filesForRoute: string[] = [];
  if (!files) {
    return filesForRoute;
  }
  const fileRE = new RegExp(`^(.*\\W)?page\\.${route}(\\W.*)?.${ext}$`);
  for (const filename in files) {
    if (fileRE.test(filename)) {
      filesForRoute.push(files[filename]);
    }
  }
  filesForRoute.push(
    ...fixedFiles.map(name => files && files[name]).filter(Boolean)
  );
  return filesForRoute;
}

export function clientAssets() {
  let files: Manifest | undefined;

  return async (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (!files) {
        // eslint-disable-next-line require-atomic-updates
        files = await readManifest();
      }

      if (!files) {
        throw new Error('Cannot find assets');
      }

      const state = res.locals.state;
      const route = getRoute(state.state);

      state.files = files;
      state.css = getFilesForRoute(files, route, 'css', [DEFAULT_CSS]);
      state.js = getFilesForRoute(files, route, 'js', [DEFAULT_JS]);

      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line require-atomic-updates
        files = undefined;
      }

      next();
    } catch (err) {
      console.log(err);

      res.status(500).end();
    }
  };
}
