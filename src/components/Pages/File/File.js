import React from 'react';
import PropTypes from 'prop-types';

import { cnSection } from 'components/Section/Section';
import { cnDivider } from 'components/Divider/Divider';
import { FilePath } from 'components/FilePath/FilePath';
import { FileHeader } from 'components/FileHeader/FileHeader';
import { NotFoundPage } from '../404/404';
import { Tabs } from 'components/Tabs/Tabs';
import { FileContent } from 'components/FileContent/FileContent';

function getTabs({ repoId, branch, path }) {
  return [
    {
      tab: 'Details',
      to: `/${repoId}/blob/${branch}/${path}`,
    },
    {
      tab: 'History',
      to: `/${repoId}/commits/${branch}/${path}`,
    },
  ];
}

export const FilePage = function({ data, repo }) {
  if (!repo || !data) {
    return <NotFoundPage />;
  }

  const { branch, path, file } = data;
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
        <Tabs tabs={getTabs({ repoId, branch, path })} activeTab={'Details'} />
      </div>
      <div className={cnSection({ 'indent-b': 's' })}>
        <FileContent content={file} filename={path.split('/').pop()} />
      </div>
    </>
  );
};

FilePage.propTypes = {
  data: PropTypes.shape({
    branch: PropTypes.string,
    path: PropTypes.string,
    file: PropTypes.string,
  }),
  repo: PropTypes.object,
};

export default FilePage;
