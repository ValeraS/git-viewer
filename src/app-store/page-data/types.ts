export const SET_PAGE_DATA = 'SET_PAGE_DATA';
export const SET_PAGE_URL = 'SET_PAGE_URL';

export interface SetPageDataAction {
  type: typeof SET_PAGE_DATA;
  payload: PageData;
}

export interface SetPageUrlAction {
  type: typeof SET_PAGE_URL;
  payload: string;
}

export interface PageData {}

export type PageState =
  | { data: PageData | null; url: string }
  | undefined
  | null;

export type PageActionTypes = SetPageDataAction | SetPageUrlAction;