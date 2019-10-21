import {
  RepoState,
  RepoActionTypes,
  SET_REPO_STATE,
} from 'app-store/repo/types';

export function repoReducer(state: RepoState, action: RepoActionTypes) {
  switch (action.type) {
    case SET_REPO_STATE:
      return action.payload;
    default:
      return state || null;
  }
}
