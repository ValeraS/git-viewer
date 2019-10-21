import {
  PageState,
  PageActionTypes,
  SET_PAGE_DATA,
  SET_PAGE_URL,
} from 'app-store/page-data/types';

export function pageDataReducer(
  state: PageState,
  action: PageActionTypes
): PageState {
  switch (action.type) {
    case SET_PAGE_DATA:
      return {
        ...state,
        data: action.payload,
      };
    case SET_PAGE_URL:
      return {
        ...state,
        url: action.payload,
      };
    default:
      return state || null;
  }
}
