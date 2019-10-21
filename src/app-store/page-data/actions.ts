import { matchUrl } from 'server/utils/matchUrl';
import { PAGES } from 'pages';
import {
  PageData,
  SetPageDataAction,
  SET_PAGE_DATA,
  SetPageUrlAction,
  SET_PAGE_URL,
} from 'app-store/page-data/types';

export function setPageData(data: PageData): SetPageDataAction {
  return {
    type: SET_PAGE_DATA,
    payload: data,
  };
}

export function setPageUrl(url: string): SetPageUrlAction {
  return {
    type: SET_PAGE_URL,
    payload: url,
  };
}

export function fetchPageData(path: string) {
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
