/* global _dynamicImport */

import { lazyComponentBabel } from 'components/Lazy/Lazy';

export const Routes = Object.freeze({
  HOME: 'home',
  NOT_FOUND: 'notFound',
  FILES: 'files',
});

export const PAGES = {
  [Routes.HOME]: {
    exact: true,
    path: '/',
    component: lazyComponentBabel(() =>
      _dynamicImport(
        /* webpackChunkName: "page.home" */ 'components/Pages/Home/Home'
      )
    ),
  },
  [Routes.FILES]: {
    path: ['/:repoId/tree/:path*', '/:repoId'],
    component: lazyComponentBabel(() =>
      _dynamicImport(
        /* webpackChunkName: "page.files" */ 'components/Pages/Files/Files'
      )
    ),
  },
  [Routes.NOT_FOUND]: {
    component: lazyComponentBabel(() =>
      _dynamicImport(
        /* webpackChunkName: "page.notFound" */ 'components/Pages/404/404'
      )
    ),
  },
};
