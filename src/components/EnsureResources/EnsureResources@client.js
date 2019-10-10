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
  const repo = useSelector(getRepo) || {};
  const data = useSelector(getPageData);
  const pageUrl = useSelector(getPageUrl);
  const [state, setState] = useState({ location, repo, data });
  const [updateView, setUpdateView] = useState({});

  const dispatch = useDispatch();
  const match = matchPath(location.pathname, '/:repoId');

  const nextRepoId = (match && match.params.repoId) || '';
  const needUpdateRepo = nextRepoId !== repo.repoId;
  const needUpdatePageData = location.pathname !== pageUrl;

  useEffect(() => {
    async function waitForSources(sources) {
      await Promise.all(sources);
      setUpdateView(true);
    }
    const sources = [];
    if (needUpdatePageData) {
      sources.push(dispatch(fetchPageData(location.pathname)));
    }
    if (needUpdateRepo) {
      sources.push(dispatch(fetchRepo(nextRepoId)));
    }
    if (sources.length) {
      waitForSources(sources);
    }
  }, [
    location.pathname,
    needUpdatePageData,
    dispatch,
    needUpdateRepo,
    nextRepoId,
  ]);

  if (updateView) {
    setUpdateView(false);
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
