import { PAGES } from 'pages';
import { matchPath } from 'react-router';

export function matchUrl(url) {
  for (let route of Object.keys(PAGES)) {
    let result = matchPath(url, PAGES[route]);

    if (result) {
      return { route, ...result };
    }
  }
}
