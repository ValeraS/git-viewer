import { PAGES, Routes } from 'pages';
import { matchPath } from 'react-router';
import { RouterParams } from 'app-store/router/types';

export function matchUrl(url: string) {
  for (const route of Object.keys(PAGES) as Routes[]) {
    const result = matchPath<RouterParams>(url, PAGES[route]);

    if (result) {
      return { route, ...result };
    }
  }
  return null;
}
