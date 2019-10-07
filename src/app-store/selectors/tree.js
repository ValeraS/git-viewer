export function getTree(state) {
  if (state && state.tree && state.tree.tree) {
    return state.tree.tree;
  }

  return null;
}

export function getTreePath(state) {
  if (state && state.tree && state.tree.path) {
    return state.tree.path;
  }

  return null;
}

export function getTreeBranch(state) {
  if (state && state.tree && state.tree.branch) {
    return state.tree.branch;
  }

  return null;
}

export function getTreeState(state) {
  return state && state.tree;
}
