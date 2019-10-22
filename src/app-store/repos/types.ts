export const SET_REPOS = 'SET_REPOS';

export interface SetReposAction {
  type: typeof SET_REPOS;
  payload: ReposState;
}

export type ReposState = string[] | undefined | null;

export type ReposActionTypes = SetReposAction;
