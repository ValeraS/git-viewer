import { composeWithDevTools } from 'redux-devtools-extension';
import {
  createStore as createStoreRedux,
  applyMiddleware,
  combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import { routerReducer } from 'app-store/router/reducers';

export const MERGE_STATE = 'MERGE_STATE';

let storeReducer = combineReducers({
  router: routerReducer,
});

export function mergeState(state) {
  return {
    type: MERGE_STATE,
    payload: state,
  };
}

export function rootReducer(state, action) {
  state = storeReducer(state, action);

  switch (action.type) {
    case 'MERGE_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function createStore(state) {
  let enhancer = composeWithDevTools(applyMiddleware(thunk));

  return createStoreRedux(rootReducer, state, enhancer);
}
