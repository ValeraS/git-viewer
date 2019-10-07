export const ActionTypes = Object.freeze({
  SET_REPOS: 'SET_REPOS',
});

export function setRepos(repos) {
  return {
    type: ActionTypes.SET_REPOS,
    payload: repos,
  };
}
