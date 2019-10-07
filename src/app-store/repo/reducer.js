import { ActionTypes } from './actions';

export function repoReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_REPO_STATE:
      return action.payload;
    case ActionTypes.SET_REPO_LOADING:
      return {
        ...state,
        repoStateLoading: action.payload,
      };
    default:
      return state || null;
  }
}
