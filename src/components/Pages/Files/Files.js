import React from 'react';
import PropTypes from 'prop-types';

import { cnSection } from 'components/Section/Section';
import { FilePath } from 'components/FilePath/FilePath';
import { cnDivider } from 'components/Divider/Divider';
import { FileHeader } from 'components/FileHeader/FileHeader';
import { Tabs } from 'components/Tabs/Tabs';
import { FileList } from 'components/FileList/FileList';

export const FilesPage = function({ data = {}, repo = {} }) {
  const { branch, path, files = [] } = data || {};
  const { repoId, branches = [] } = repo;
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
  repo: PropTypes.object,
};

export default FilesPage;
