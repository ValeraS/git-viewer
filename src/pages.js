import { lazyComponentBabel } from 'components/Lazy/Lazy';

export const Routes = Object.freeze({
  HOME: 'home',
  NOT_FOUND: 'notFound',
});

export const PAGES = {
  [Routes.HOME]: {
    exact: true,
    path: '/',
    component: lazyComponentBabel(() =>
      // eslint-disable-next-line no-undef
      dynamicImport(
        /* webpackChunkName: "page.notFound" */ 'components/Pages/404/404'
      )
    ),
  },
  [Routes.NOT_FOUND]: {
    path: '*',
    component: lazyComponentBabel(() =>
      // eslint-disable-next-line no-undef
      dynamicImport(
        /* webpackChunkName: "page.notFound" */ 'components/Pages/404/404'
      )
    ),
  },
};
