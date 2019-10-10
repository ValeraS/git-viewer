import { ActionTypes } from './actions';

export function repoReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_REPO_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state || null;
  }
}
