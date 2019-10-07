import { ActionTypes } from './actions';

export function reposReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_REPOS:
      return action.payload;
    default:
      return state || null;
  }
}
