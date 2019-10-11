import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';
import { CommitHash } from 'components/CommitHash/CommitHash';
import { User } from 'components/User/User';

import './CommitData.css';

export const cnCommitData = cn('CommitData');

export const CommitData = function({ repoId, data, className }) {
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

CommitData.propTypes = {
  repoId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    hash: PropTypes.string.isRequired,
    committer: PropTypes.string.isRequired,
    relativeDate: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};
