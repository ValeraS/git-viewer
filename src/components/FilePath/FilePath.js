import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';

import { Link } from 'components/Link/Link';

import './FilePath.css';

export const cnFilePath = cn('FilePath');

export const FilePath = function({ path, repoId, branch, className }) {
  if (!path) {
    return (
      <ul className={cnFilePath(null, [className])}>
        <li className={cnFilePath('CurrentItem')}>{repoId}</li>
      </ul>
    );
  }

  let currentPath = `/${repoId}/tree/${branch}`;
  const pathItems = path.split('/');
  return (
    <ul className={cnFilePath(null, [className])}>
      <li className={cnFilePath('Item')}>
        <Link to={currentPath} className={cnFilePath('Link')}>
          {repoId}
        </Link>
      </li>
      {pathItems.slice(0, -1).map((name, index) => {
        currentPath = `${currentPath}/${name}`;
        return (
          <li key={index} className={cnFilePath('Item')}>
            <Link to={currentPath} className={cnFilePath('Link')}>
              {name}
            </Link>
          </li>
        );
      })}
      <li className={cnFilePath('CurrentItem')}>
        {pathItems[pathItems.length - 1]}
      </li>
    </ul>
  );
};

FilePath.propTypes = {
  path: PropTypes.string,
  repoId: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  className: PropTypes.string,
};
