import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setPageUrl, setPageData } from 'app-store/page-data/actions';
import { getPageUrl, getPageData } from 'app-store/selectors/page-data';

export const EnsureResources = function(Component) {
  function WithResources({ match, ...props }) {
    const pageData = useSelector(getPageData);
    const prevUrl = useSelector(getPageUrl);
    const dispatch = useDispatch();

    useEffect(() => {
      let abort = false;
      async function getState() {
        const data = await Component.prepareState(match);
        if (!abort) {
          dispatch(setPageUrl(match.url));
          dispatch(setPageData(data));
        }
      }
      if (prevUrl !== match.url) {
        getState();
      }
      return () => {
        abort = true;
      };
    }, [dispatch, match, prevUrl]);

    return <Component data={pageData} match={match} {...props} />;
  }

  WithResources.propTypes = {
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
  };

  return WithResources;
};
