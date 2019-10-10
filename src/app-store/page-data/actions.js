import { matchUrl } from 'server/utils/matchUrl';
import { PAGES } from 'pages';

export function setPageData(data) {
  return {
    type: 'SET_PAGE_DATA',
    payload: data,
  };
}

export function setPageUrl(url) {
  return {
    type: 'SET_PAGE_URL',
    payload: url,
  };
}

export function fetchPageData(path) {
  const result = matchUrl(path);
  const preparePageData = result && PAGES[result.route].preparePageData;
  return async function(dispatch) {
    if (typeof preparePageData === 'function') {
      try {
        const pageData = await preparePageData(result);
        dispatch(setPageData(pageData));
      } catch (err) {
        console.error(err);
      }
    } else {
      dispatch(setPageData(null));
    }
    dispatch(setPageUrl(path));
  };
}
