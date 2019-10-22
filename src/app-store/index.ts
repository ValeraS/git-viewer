import { composeWithDevTools } from 'redux-devtools-extension';
import {
  createStore as createStoreRedux,
  applyMiddleware,
  combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import { routerReducer } from 'app-store/router/reducers';
import { reposReducer } from 'app-store/repos/reducer';
import { repoReducer } from 'app-store/repo/reducer';
import { pageDataReducer } from './page-data/reducer';
import { ReposActionTypes } from './repos/types';
import { RepoActionTypes } from './repo/types';
import { PageActionTypes } from './page-data/types';

export const INIT = 'INIT';
export const MERGE_STATE = 'MERGE_STATE';

const storeReducer = combineReducers({
  router: routerReducer,
  pageData: pageDataReducer,
  repos: reposReducer,
  repo: repoReducer,
});

export type AppState = ReturnType<typeof storeReducer>;

export type AppTypes =
  | ReposActionTypes
  | RepoActionTypes
  | PageActionTypes
  | MergeStateAction
  | InitAction;

export interface MergeStateAction {
  type: typeof MERGE_STATE;
  payload: Partial<AppState>;
}

type InitAction = {
  type: typeof INIT;
};

export function mergeState(state: Partial<AppState>): MergeStateAction {
  return {
    type: MERGE_STATE,
    payload: state,
  };
}

export function rootReducer(
  state: AppState | undefined,
  action: AppTypes
): AppState {
  state = storeReducer(state, action);

  switch (action.type) {
    case 'MERGE_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function createStore(state: AppState) {
  const enhancer = composeWithDevTools(applyMiddleware(thunk));

  return createStoreRedux<AppState, AppTypes, {}, {}>(
    rootReducer,
    state,
    enhancer
  );
}
