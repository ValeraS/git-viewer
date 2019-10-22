import { prepareDataHandler } from 'pages';

export const prepareState: prepareDataHandler = async function({ url }) {
  try {
    const res = await fetch(`/api/repos/${url}`);
    if (res.status < 200 || res.status >= 300) {
      throw new Error(await res.json());
    }
    return await res.json();
  } catch (err) {
    console.error(err);
  }
  return null;
};
