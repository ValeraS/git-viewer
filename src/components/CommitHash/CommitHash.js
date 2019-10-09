import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';
import { Link } from 'components/Link/Link';

export const cnCommitHash = cn('CommitHash');

export const CommitHash = function({ repoId, hash, maxLength }) {
  return (
    <Link to={`/${repoId}/commit/${hash}`} className={cnCommitHash()}>
      {maxLength ? hash.substr(0, maxLength) : hash}
    </Link>
  );
};

CommitHash.propTypes = {
  repoId: PropTypes.string.isRequired,
  hash: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
};
