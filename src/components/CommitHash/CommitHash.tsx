import React from 'react';
import { cn } from '@bem-react/classname';
import { compose, IClassNameProps } from '@bem-react/core';

import { Link as BaseLink, withLinkColorDefault } from 'components/Link';

export const cnCommitHash = cn('CommitHash');

export interface CommitHashProps extends IClassNameProps {
  repoId: string;
  hash: string;
  maxLength?: number;
}

const Link = compose(withLinkColorDefault)(BaseLink);

export const CommitHash: React.FC<CommitHashProps> = function({
  repoId,
  hash,
  maxLength,
  className,
}) {
  return (
    <Link
      to={`/${repoId}/commit/${hash}`}
      color="default"
      className={cnCommitHash(null, [className])}
    >
      {maxLength ? hash.substr(0, maxLength) : hash}
    </Link>
  );
};
