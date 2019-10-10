export async function prepareState({ url }) {
  let tree;
  try {
    const res = await fetch(`/api/repos/${url}`);
    tree = await res.json();
  } catch (err) {
    console.error(err);
  }
  return tree;
}
