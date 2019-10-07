import { getRepo } from '../selectors/repo';

export const ActionTypes = Object.freeze({
  SET_REPO_LOADING: 'SET_REPO_LOADING',
  SET_REPO_STATE: 'SET_REPO_STATE',
});

export function getTree(url) {
  return async function(dispatch, getState) {
    try {
      let repo = getRepo(getState());

      if (repo && repo.url && repo.url === url) {
        return;
      }

      dispatch(setRepoLoading(true));

      let response = await fetch('/api/repos' + url);
      let data = await response.json();

      dispatch(setRepoState(data));
    } finally {
      dispatch(setRepoLoading(false));
    }
  };
}

export function setRepoLoading(loading) {
  return {
    type: ActionTypes.SET_REPO_LOADING,
    payload: loading,
  };
}

export function setRepoState(data) {
  return {
    type: ActionTypes.SET_REPO_STATE,
    payload: data,
  };
}
