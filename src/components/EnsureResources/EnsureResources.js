import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setPageUrl, setPageData } from 'app-store/page-data/actions';
import { getPageUrl, getPageData } from 'app-store/selectors/page-data';
import { getRepo } from 'app-store/selectors/repo';
import { setRepoState } from 'app-store/repo/actions';

export const EnsureResources = function(Component) {
  function WithResources({ match, ...props }) {
    const pageData = useSelector(getPageData);
    const repo = useSelector(getRepo) || {};
    const prevUrl = useSelector(getPageUrl);
    const dispatch = useDispatch();

    useEffect(() => {
      let abort = false;
      async function getState() {
        const sources = [Component.prepareState(match)];
        if (match.params.repoId && match.params.repoId !== repo.repoId) {
          sources.push(fetchRepo(match.params.repoId));
        }
        const [data, repoData] = await Promise.all(sources);
        if (!abort) {
          dispatch(setPageUrl(match.url));
          dispatch(setPageData(data));
          if (repoData) {
            dispatch(setRepoState(repoData));
          }
        }
      }
      if (prevUrl !== match.url) {
        getState();
      }
      return () => {
        abort = true;
      };
    }, [dispatch, match, prevUrl, repo]);

    return <Component repo={repo} data={pageData} match={match} {...props} />;
  }

  WithResources.propTypes = {
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
      params: PropTypes.shape({
        repoId: PropTypes.string,
      }).isRequired,
    }),
  };

  async function fetchRepo(repoId) {
    try {
      const response = await fetch(`/api/repos/${repoId}/branches`);
      const branches = await response.json();
      return { repoId, branches };
    } catch (err) {
      return null;
    }
  }

  return WithResources;
};
