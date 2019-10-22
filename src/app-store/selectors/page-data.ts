import { AppState } from "app-store";

export function getPageData(state: AppState) {
  return (state && state.pageData && state.pageData.data) || null;
}

export function getPageUrl(state: AppState) {
  return (state && state.pageData && state.pageData.url) || null;
}
