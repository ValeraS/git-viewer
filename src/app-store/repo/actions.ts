import { SET_REPO_STATE, RepoState, SetRepoAction } from 'app-store/repo/types';
import { ThunkAction } from 'redux-thunk';
import { AppState, AppTypes } from 'app-store';

export function setRepoState(data: RepoState): SetRepoAction {
  return {
    type: SET_REPO_STATE,
    payload: data,
  };
}

export function fetchRepo(
  repoId: string
): ThunkAction<Promise<void>, AppState, null, AppTypes> {
  return async function(dispatch) {
    if (!repoId) {
      dispatch(setRepoState(null));
      return;
    }
    try {
      const response = await fetch(`/api/repos/${repoId}/branches`);
      const branches = await response.json();
      if (response.status < 200 || response.status >= 300) {
        throw new Error(branches);
      }
      dispatch(setRepoState({ repoId, branches }));
    } catch (err) {
      console.error(err);
      dispatch(setRepoState(null));
    }
  };
}
