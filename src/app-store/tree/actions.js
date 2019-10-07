export const ActionTypes = Object.freeze({
  SET_TREE: 'SET_TREE',
  SET_TREE_LOADING: 'SET_TREE_LOADING',
  SET_TREE_ERROR_LOADING: 'SET_TREE_ERROR_LOADING',
});

export function setTree(tree) {
  return {
    type: ActionTypes.SET_TREE,
    payload: tree,
  };
}

export function setTreeLoading() {
  return {
    type: ActionTypes.SET_TREE_LOADING,
  };
}

export function setTreeErrorLoading(err) {
  return {
    type: ActionTypes.SET_TREE_ERROR_LOADING,
    payload: err,
  };
}

export function fetchTree(url) {
  return async function(dispatch) {
    try {
      dispatch(setTreeLoading());

      const res = await fetch(`/api/repos/${url}`);
      const data = await res.json();

      dispatch(setTree({ ...data, url }));
    } catch (err) {
      console.error(err);
      dispatch(setTreeErrorLoading(err));
    }
  };
}
