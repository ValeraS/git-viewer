import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';
import { CommitHash } from 'components/CommitHash/CommitHash';
import { User } from 'components/User/User';

import './CommitData.css';

export const cnCommitData = cn('CommitData');

export const CommitData = function({ repoId, data, className }) {
  const { hash, date, committer } = data;
  return (
    <div className={cnCommitData(null, [className])}>
      {'Last commit '}
      <CommitHash hash={hash} repoId={repoId} maxLength={6} />
      {' on '}
      <span className={cnCommitData('Date')}>
        {new Date(date).toDateString()}
      </span>
      {' by '}
      <User user={committer} />
    </div>
  );
};

CommitData.propTypes = {
  repoId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    hash: PropTypes.string.isRequired,
    committer: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};
