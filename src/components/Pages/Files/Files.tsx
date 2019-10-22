import React from 'react';

import { cnSection } from 'components/Section/Section';
import { FilePath } from 'components/FilePath/FilePath';
import { cnDivider } from 'components/Divider/Divider';
import { FileHeader } from 'components/FileHeader/FileHeader';
import { Tabs } from 'components/Tabs/Tabs';
import { FileList } from 'components/FileList/FileList';
import { NotFoundPage } from '../404/404';
import { RepoState } from 'app-store/repo/types';
import { RouterParams } from 'app-store/router/types';
import { RouteComponentProps } from 'react-router';

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
      tab: 'Files',
      to: `/${repoId}/tree/${branch}/${path}`,
    },
    {
      tab: 'Branches',
      to: `/${repoId}/branches`,
    },
  ];
}

export type FileType = 'tree' | 'blob';

export interface FileInfo {
  filename: string;
  type: FileType;
  subject: string;
}

export interface CommitData {
  hash: string;
  committer: string;
  relativeDate: string;
}

export type FileData = FileInfo & CommitData;

export interface FilesPageData {
  branch: string;
  path: string;
  files: FileData[];
  lastCommit: CommitData;
}
export interface FilesPageProps {
  data?: FilesPageData;
  repo?: RepoState;
}

export const FilesPage: React.FC<
  FilesPageProps & RouteComponentProps<RouterParams>
> = function({ data, repo }) {
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

export default FilesPage;
