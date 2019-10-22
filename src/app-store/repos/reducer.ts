import { ReposState, ReposActionTypes, SET_REPOS } from 'app-store/repos/types';

export function reposReducer(
  state: ReposState,
  action: ReposActionTypes
): ReposState {
  switch (action.type) {
    case SET_REPOS:
      return action.payload;
    default:
      return state || null;
  }
}
