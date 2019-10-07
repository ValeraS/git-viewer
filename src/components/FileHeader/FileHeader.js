import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';

import './FileHeader.css';
import { cnTypo } from 'components/Typo/Typo';

export const cnFileHeader = cn('FileHeader');

export const FileHeader = function({
  repo,
  // branches,
  // branch,
  path,
  className,
}) {
  const title = !path ? repo : path.split('/').slice(-1)[0];

  return (
    <div className={cnFileHeader(null, [className])}>
      <h1 className={cnFileHeader('Title', [cnTypo({ size: 'xl' })])}>
        {title}
      </h1>
    </div>
  );
};

FileHeader.propTypes = {
  repo: PropTypes.string,
  branches: PropTypes.array,
  branch: PropTypes.string,
  path: PropTypes.string,
  className: PropTypes.string,
};
