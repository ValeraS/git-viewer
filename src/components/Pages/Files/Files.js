import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { cnSection } from 'components/Section/Section';
import { FilePath } from 'components/FilePath/FilePath';
import { cnDivider } from 'components/Divider/Divider';
import { FileHeader } from 'components/FileHeader/FileHeader';
import { Tabs } from 'components/Tabs/Tabs';
import { FileList } from 'components/FileList/FileList';
import { EnsureResources } from 'components/EnsureResources/EnsureResources';
import { getRepo } from 'app-store/selectors/repo';

export const FilesPage = function({ data: { branch, path, files } }) {
  const { repoId, branches } = useSelector(getRepo);
  return (
    <>
      <div className={cnSection({ 'indent-b': 's' }, [cnDivider()])}>
        <FilePath path={path} repo={repoId} branch={branch} />
      </div>
      <div>
        <FileHeader
          repo={repoId}
          branches={branches}
          branch={branch}
          path={path}
        />
      </div>
      <div className={cnSection({ 'indent-b': 's' }, [cnDivider()])}>
        <Tabs tabs={['Files', 'Branches']} activeTab={'Files'} />
      </div>
      <div className={cnSection({ 'overflow-x': 'auto' })}>
        <FileList files={files} path={path} repoId={repoId} branch={branch} />
      </div>
    </>
  );
};

FilesPage.propTypes = {
  data: PropTypes.shape({
    branch: PropTypes.string,
    path: PropTypes.string,
    files: PropTypes.array,
  }),
};

FilesPage.prepareState = async function({ url }) {
  let tree;
  try {
    const res = await fetch(`/api/repos/${url}`);
    tree = await res.json();
  } catch (err) {
    console.error(err);
  }
  return tree;
};

export default EnsureResources(FilesPage);
