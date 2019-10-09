export function getPageData(state) {
  return (state && state.pageData && state.pageData.data) || null;
}

export function getPageUrl(state) {
  return (state && state.pageData && state.pageData.url) || null;
}
