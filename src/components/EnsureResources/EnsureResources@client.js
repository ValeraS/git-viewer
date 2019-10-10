import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, matchPath } from 'react-router';
import { fetchPageData } from 'app-store/page-data/actions';
import { getPageData, getPageUrl } from 'app-store/selectors/page-data';
import { getRepo } from 'app-store/selectors/repo';
import { fetchRepo } from 'app-store/repo/actions';

export const EnsureResources = function({ children }) {
  const location = useLocation();
  const repo = useSelector(getRepo);
  const data = useSelector(getPageData);
  const pageUrl = useSelector(getPageUrl);
  const [state, setState] = useState({ location, repo, data });
  const [prevLocation, setPrevLocation] = useState({});

  const dispatch = useDispatch();
  const match = matchPath(location.pathname, '/:repoId');

  const isLocationChanged = prevLocation !== location;
  const nextRepoId = match.params.repoId;
  const needUpdateRepo = nextRepoId && nextRepoId !== repo.repoId;
  const needUpdatePageData = location.pathname !== pageUrl;

  useEffect(() => {
    if (needUpdateRepo && isLocationChanged) {
      dispatch(fetchRepo(nextRepoId));
    }
  }, [nextRepoId, needUpdateRepo, isLocationChanged, dispatch]);

  useEffect(() => {
    if (needUpdatePageData) {
      dispatch(fetchPageData(location.pathname));
    }
  }, [location.pathname, needUpdatePageData, dispatch]);

  if (isLocationChanged) {
    setPrevLocation(location);
  }

  if (
    !needUpdateRepo &&
    !needUpdatePageData &&
    (state.repo !== repo || state.data !== data)
  ) {
    setState({ location, repo, data });
  }

  const memorizedChildren = useCallback(() => children(state), [
    children,
    state,
  ]);
  return memorizedChildren();
};

EnsureResources.propTypes = {
  children: PropTypes.func.isRequired,
};
