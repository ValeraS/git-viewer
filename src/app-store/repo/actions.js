export const ActionTypes = Object.freeze({
  SET_REPO_LOADING: 'SET_REPO_LOADING',
  SET_REPO_STATE: 'SET_REPO_STATE',
  SET_REPO_ERROR: 'SET_REPO_ERROR',
});

export function fetchRepo(repoId) {
  return async function(dispatch) {
    try {
      dispatch(setRepoLoading(true));

      let response = await fetch(`/api/repos/${repoId}/branches`);
      let branches = await response.json();

      dispatch(setRepoState({ repoId, branches }));
    } catch (err) {
      dispatch(setRepoError(err));
    }
  };
}

export function setRepoLoading() {
  return {
    type: ActionTypes.SET_REPO_LOADING,
  };
}

export function setRepoState(data) {
  return {
    type: ActionTypes.SET_REPO_STATE,
    payload: data,
  };
}

export function setRepoError(err) {
  return {
    type: ActionTypes.SET_REPO_ERROR,
    payload: err,
  };
}
