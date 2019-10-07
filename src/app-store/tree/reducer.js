import { ActionTypes } from './actions';

export function treeReducer(state, { type, payload }) {
  switch (type) {
    case ActionTypes.SET_TREE:
      return payload;
    case ActionTypes.SET_TREE_LOADING:
      return {
        loading: true,
      };
    case ActionTypes.SET_TREE_ERROR_LOADING:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state || null;
  }
}
