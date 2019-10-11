import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';

import { cnTypo } from 'components/Typo/Typo';
import { CommitData } from 'components/CommitData/CommitData';
import { BranchSelector } from 'components/BranchSelector/BranchSelector';

import './FileHeader.css';

export const cnFileHeader = cn('FileHeader');

export const FileHeader = function({
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
      <CommitData
        data={lastCommit}
        repoId={repoId}
        className={cnTypo({ size: 'm' })}
      />
    </div>
  );
};

FileHeader.propTypes = {
  repoId: PropTypes.string,
  branches: PropTypes.array,
  branch: PropTypes.string,
  path: PropTypes.string,
  className: PropTypes.string,
  lastCommit: PropTypes.object,
};
