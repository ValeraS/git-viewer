export const SET_REPO_STATE = 'SET_REPO_STATE';

export interface SetRepoAction {
  type: typeof SET_REPO_STATE;
  payload: RepoState;
}

export interface Repo {
  repoId: string;
  branches: Branch[];
}

export interface Branch {
  name: string;
  active: boolean;
}

export type RepoState = Repo | undefined | null;

export type RepoActionTypes = SetRepoAction;
