import { ActionTypes } from './actions';

export function repoReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_REPO_STATE:
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
        completed: true,
      };
    case ActionTypes.SET_REPO_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
        completed: false,
      };
    case ActionTypes.SET_REPO_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        completed: false,
      };
    default:
      return state || null;
  }
}
