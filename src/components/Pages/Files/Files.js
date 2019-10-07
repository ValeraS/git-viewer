import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { cnSection } from 'components/Section/Section';
import { FilePath } from 'components/FilePath/FilePath';
import { getRepo } from 'app-store/selectors/repo';
import { getTreeState } from 'app-store/selectors/tree';
import { fetchTree } from 'app-store/tree/actions';
import { cnDivider } from 'components/Divider/Divider';
import { FileHeader } from 'components/FileHeader/FileHeader';

const Tabs = () => null;
const FileList = () => null;

export const FilesPage = function({ match }) {
  const { repo, branches } = useSelector(getRepo);
  const dispatch = useDispatch();
  const { branch, path, files, url, loading, error } = useSelector(
    getTreeState
  );

  const isValidState = url === match.url || loading;

  useEffect(() => {
    if (!isValidState) {
      dispatch(fetchTree(match.url));
    }
  }, [isValidState, dispatch, match.url]);

  if (!isValidState || loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error loading data</h1>;
  }

  return (
    <>
      <div className={cnSection(null, [cnDivider()])}>
        <FilePath path={path} repo={repo} branch={branch} />
      </div>
      <div>
        <FileHeader
          repo={repo}
          branches={branches}
          branch={branch}
          path={path}
        />
      </div>
      <div>
        <Tabs />
      </div>
      <div className={cnSection({ 'overflow-x': 'auto' })}>
        <FileList files={files} />
      </div>
    </>
  );
};

FilesPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string,
  }),
};

export default FilesPage;
