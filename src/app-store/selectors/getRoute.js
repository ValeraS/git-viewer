import { Routes } from 'pages';

export function getRoute(state) {
  if (state && state.router && state.router.route) {
    return state.router.route;
  }

  return Routes.NOT_FOUND;
}
