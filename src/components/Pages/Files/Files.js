import React from 'react';
import PropTypes from 'prop-types';

import { cnSection } from 'components/Section/Section';
import { FilePath } from 'components/FilePath/FilePath';
import { cnDivider } from 'components/Divider/Divider';
import { FileHeader } from 'components/FileHeader/FileHeader';
import { Tabs } from 'components/Tabs/Tabs';
import { FileList } from 'components/FileList/FileList';
import { NotFoundPage } from '../404/404';

function getTabs({ repoId, branch, path }) {
  return [
    {
      tab: 'Files',
      to: `/${repoId}/tree/${branch}/${path}`,
    },
    {
      tab: 'Branches',
      to: `/${repoId}/branches`,
    },
  ];
}

export const FilesPage = function({ data, repo }) {
  if (!repo || !data) {
    return <NotFoundPage />;
  }
  const { branch, path, files = [], lastCommit } = data || {};
  const { repoId, branches = [] } = repo;
  return (
    <>
      <div className={cnSection({ 'indent-b': 's' }, [cnDivider()])}>
        <FilePath path={path} repoId={repoId} branch={branch} />
      </div>
      <div className={cnSection({ 'indent-b': 's' })}>
        <FileHeader
          repoId={repoId}
          branches={branches}
          branch={branch}
          path={path}
          lastCommit={lastCommit}
        />
      </div>
      <div className={cnSection({ 'indent-b': 's' }, [cnDivider()])}>
        <Tabs tabs={getTabs({ repoId, branch, path })} activeTab={'Files'} />
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
    lastCommit: PropTypes.object,
  }),
  repo: PropTypes.object,
};

export default FilesPage;
