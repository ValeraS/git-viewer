import React from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { CommitHash } from 'components/CommitHash/CommitHash';
import { User } from 'components/User/User';

import './CommitData.css';

export const cnCommitData = cn('CommitData');

export interface CommitDataProps extends IClassNameProps {
  repoId: string;
  data: {
    hash: string;
    committer: string;
    relativeDate: string;
  };
}

export const CommitData: React.FC<CommitDataProps> = function({ repoId, data, className }) {
  const { hash, relativeDate, committer } = data;
  return (
    <div className={cnCommitData(null, [className])}>
      <CommitHash hash={hash} repoId={repoId} maxLength={6} />
      {' by '}
      <User user={committer} />
      {', '}
      <span className={cnCommitData('Date')}>{relativeDate}</span>
    </div>
  );
};
