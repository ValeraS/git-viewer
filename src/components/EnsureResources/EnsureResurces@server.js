import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { getRepo } from 'app-store/selectors/repo';
import { getPageData } from 'app-store/selectors/page-data';

export const EnsureResources = function({ children }) {
  const location = useLocation();
  const repo = useSelector(getRepo);
  const data = useSelector(getPageData);

  return children({ location, repo, data });
};
