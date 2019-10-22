import { AppState } from "app-store";

export function getRepos(state: AppState) {
  if (state && state.repos) {
    return state.repos;
  }

  return null;
}
