import { SET_REPOS, SetReposAction } from 'app-store/repos/types';

export function setRepos(repos: string[]): SetReposAction {
  return {
    type: SET_REPOS,
    payload: repos,
  };
}
