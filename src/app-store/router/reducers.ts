import { RouterState } from 'app-store/router/types';

export function routerReducer(state: RouterState): RouterState {
  return state || null;
}
