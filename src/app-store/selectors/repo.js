export function getRepo(state) {
  if (state && state.repo) {
    return state.repo;
  }

  return null;
}
