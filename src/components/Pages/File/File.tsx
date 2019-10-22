import React from 'react';

import { cnSection } from 'components/Section/Section';
import { cnDivider } from 'components/Divider/Divider';
import { FilePath } from 'components/FilePath/FilePath';
import { FileHeader } from 'components/FileHeader/FileHeader';
import { NotFoundPage } from '../404/404';
import { Tabs } from 'components/Tabs/Tabs';
import { FileContent } from 'components/FileContent/FileContent';
import { RepoState } from 'app-store/repo/types';
import { CommitData } from 'components/Pages/Files/Files';

function getTabs({
  repoId,
  branch,
  path,
}: {
  repoId: string;
  branch: string;
  path: string;
}) {
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

export interface FilePageData {
  branch: string;
  path: string;
  file: string;
  lastCommit: CommitData;
}

export interface FilePageProps {
  data?: FilePageData;
  repo?: RepoState;
}

export const FilePage: React.FC<FilePageProps> = function({ data, repo }) {
  if (!repo || !data) {
    return <NotFoundPage />;
  }

  const { branch, path, file, lastCommit } = data;
  const { repoId, branches = [] } = repo;
  const filename = path.split('/').pop() || '';
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
        <Tabs tabs={getTabs({ repoId, branch, path })} activeTab={'Details'} />
      </div>
      <div className={cnSection({ 'indent-b': 's' })}>
        <FileContent content={file} filename={filename} />
      </div>
    </>
  );
};

export default FilePage;
