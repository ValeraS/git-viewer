export function getRepos(state) {
  if (state && state.repos) {
    return state.repos;
  }

  return null;
}
