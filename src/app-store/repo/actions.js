export const ActionTypes = Object.freeze({
  SET_REPO_STATE: 'SET_REPO_STATE',
});

export function fetchRepo(repoId) {
  return async function(dispatch) {
    if (!repoId) {
      dispatch(setRepoState(null));
      return;
    }
    try {
      let response = await fetch(`/api/repos/${repoId}/branches`);
      let branches = await response.json();
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

export function setRepoState(data) {
  return {
    type: ActionTypes.SET_REPO_STATE,
    payload: data,
  };
}
