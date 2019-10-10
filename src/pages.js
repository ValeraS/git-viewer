/* global _dynamicImport */

import { lazyComponentBabel } from 'components/Lazy/Lazy';
import { prepareState as prepareFilesState } from 'components/Pages/Files/Files@state';
import { prepareState as prepareFileState } from 'components/Pages/File/File@state';

export const Routes = Object.freeze({
  HOME: 'home',
  NOT_FOUND: 'notFound',
  FILES: 'files',
  FILE: 'file',
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
    exact: true,
    path: ['/:repoId/tree/:path*', '/:repoId'],
    component: lazyComponentBabel(() =>
      _dynamicImport(
        /* webpackChunkName: "page.files" */ 'components/Pages/Files/Files'
      )
    ),
    preparePageData: prepareFilesState,
  },
  [Routes.FILE]: {
    exact: true,
    path: ['/:repoId/blob/:path*'],
    component: lazyComponentBabel(() =>
      _dynamicImport(
        /* webpackChunkName: "page.file" */ 'components/Pages/File/File'
      )
    ),
    preparePageData: prepareFileState,
  },
  [Routes.NOT_FOUND]: {
    component: lazyComponentBabel(() =>
      _dynamicImport(
        /* webpackChunkName: "page.notFound" */ 'components/Pages/404/404'
      )
    ),
  },
};
