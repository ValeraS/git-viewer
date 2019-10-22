import { Routes } from 'pages';
import { AppState } from 'app-store';

export function getRoute(state: AppState) {
  if (state && state.router && state.router.route) {
    return state.router.route;
  }

  return Routes.NOT_FOUND;
}
