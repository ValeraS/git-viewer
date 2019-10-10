export const ActionTypes = Object.freeze({
  SET_REPO_STATE: 'SET_REPO_STATE',
});

export function fetchRepo(repoId) {
  return async function(dispatch) {
    try {
      let response = await fetch(`/api/repos/${repoId}/branches`);
      let branches = await response.json();

      dispatch(setRepoState({ repoId, branches }));
    } catch (err) {
      console.error(err);
    }
  };
}

export function setRepoState(data) {
  return {
    type: ActionTypes.SET_REPO_STATE,
    payload: data,
  };
}
