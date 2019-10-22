import { lazyComponentBabel } from 'components/Lazy/Lazy';
import { prepareState as prepareFilesState } from 'components/Pages/Files/Files@state';
import { prepareState as prepareFileState } from 'components/Pages/File/File@state';
import { RouteProps } from 'react-router';
import { PageData } from 'app-store/page-data/types';

export enum Routes {
  HOME = 'home',
  NOT_FOUND = 'notFound',
  FILES = 'files',
  FILE = 'file',
}

type prepareDataHandler = (arg: { url: string }) => Promise<PageData>;

export const PAGES: Record<
  Routes,
  RouteProps & { preparePageData?: prepareDataHandler }
> = {
  [Routes.HOME]: {
    exact: true,
    path: '/',
    component: lazyComponentBabel(() =>
      import(/* webpackChunkName: "page.home" */ 'components/Pages/Home/Home')
    ),
  },
  [Routes.FILES]: {
    exact: true,
    path: ['/:repoId/tree/:path*', '/:repoId'],
    component: lazyComponentBabel(() =>
      import(
        /* webpackChunkName: "page.files" */ 'components/Pages/Files/Files'
      )
    ),
    preparePageData: prepareFilesState,
  },
  [Routes.FILE]: {
    exact: true,
    path: ['/:repoId/blob/:path*'],
    component: lazyComponentBabel(() =>
      import(/* webpackChunkName: "page.file" */ 'components/Pages/File/File')
    ),
    preparePageData: prepareFileState,
  },
  [Routes.NOT_FOUND]: {
    path: '*',
    component: lazyComponentBabel(() =>
      import(/* webpackChunkName: "page.notFound" */ 'components/Pages/404/404')
    ),
  },
};
