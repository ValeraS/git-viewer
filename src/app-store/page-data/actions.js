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
