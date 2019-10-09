export function pageDataReducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE_DATA':
      return {
        ...state,
        data: action.payload,
      };
    case 'SET_PAGE_URL':
      return {
        ...state,
        url: action.payload,
      };
    default:
      return state || null;
  }
}
