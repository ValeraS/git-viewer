import React from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { Link } from 'components/Link/Link';

import './FilePath.css';

export const cnFilePath = cn('FilePath');

export interface FilePathProps extends IClassNameProps {
  path: string;
  repoId: string;
  branch: string;
}

export const FilePath: React.FC<FilePathProps> = function({
  path,
  repoId,
  branch,
  className,
}) {
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
