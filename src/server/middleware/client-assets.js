import { readFile } from 'fs';
import { join } from 'path';
import { getRoute } from 'app-store/selectors/getRoute';

const DEFAULT_CSS = 'main.css';
const DEFAULT_JS = 'main.js';

function readManifest() {
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

export function clientAssets() {
  let files;

  return async (req, res, next) => {
    try {
      if (!files) {
        // eslint-disable-next-line require-atomic-updates
        files = await readManifest();
      }

      if (!files) {
        throw new Error('Cannot find assets');
      }

      const getFiles = names =>
        names.map(name => files && files[name]).filter(Boolean);
      const state = res.locals.state;
      const route = getRoute(state.state);

      state.files = files;
      state.css = getFiles([DEFAULT_CSS, `page.${route}.css`]);
      state.js = getFiles([`page.${route}.js`, DEFAULT_JS]);

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
