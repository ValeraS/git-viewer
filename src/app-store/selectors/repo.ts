import { AppState } from "app-store";

export function getRepo(state: AppState) {
  if (state && state.repo) {
    return state.repo;
  }

  return null;
}
