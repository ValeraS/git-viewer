import React from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { cnTypo } from 'components/Typo/Typo';
import { CommitData } from 'components/CommitData/CommitData';
import { BranchSelector } from 'components/BranchSelector/BranchSelector';
import { CommitData as ICommitData } from 'components/Pages/Files/Files';
import { Branch } from 'app-store/repo/types';

import './FileHeader.css';

export const cnFileHeader = cn('FileHeader');

export interface FileHeaderProps extends IClassNameProps {
  repoId: string;
  branches: Branch[];
  branch: string;
  path: string;
  lastCommit: ICommitData;
}

export const FileHeader: React.FC<FileHeaderProps> = function({
  repoId,
  branches,
  branch,
  path,
  className,
  lastCommit,
}) {
  const title = !path ? repoId : path.split('/').slice(-1)[0];

  return (
    <div className={cnFileHeader(null, [className])}>
      <div className={cnFileHeader('Line')}>
        <h1 className={cnFileHeader('Title', [cnTypo({ size: 'xl' })])}>
          {title}
        </h1>
        <BranchSelector {...{ repoId, branches, branch, path }} />
      </div>
      <div className={cnTypo({ size: 'm' })}>
        {'Last commit '}
        <CommitData data={lastCommit} repoId={repoId} />
      </div>
    </div>
  );
};
