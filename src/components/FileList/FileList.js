import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';
import { compose, composeU } from '@bem-react/core';

import { cnTypo } from 'components/Typo/Typo';
import { cnDivider } from 'components/Divider/Divider';
import { cnTable } from 'components/Table/Table';
import { Link } from 'components/Link';
import { CommitHash } from 'components/CommitHash/CommitHash';
import { User } from 'components/User/User';
import {
  Icon as BaseIcon,
  withIconTypeBlob,
  withIconTypeTree,
} from 'components/Icon';

import 'components/Table/Table.css';

export const cnFileList = cn('FileList');
export const cnFileIcon = cn('FileIcon');

const FileIcon = compose(composeU(withIconTypeBlob, withIconTypeTree))(
  BaseIcon
);

function makeSlug({ type, filename, path, repoId, branch }) {
  return `/${repoId}/${type}/${branch}/${path}/${filename}`
    .replace(/\/\//g, '/')
    .replace(/\/$/, '');
}

export const FileList = function({ files, path, repoId, branch, className }) {
  return (
    <table
      className={cnFileList(null, [
        className,
        cnTable(),
        cnTypo({ size: 'm' }),
      ])}
    >
      <thead className={cnDivider()}>
        <tr className={cnTable('Head')}>
          <td colSpan={2} className={cnTable('Col')}>
            {'Name'}
          </td>
          <td className={cnTable('Col')}>{'Last Commit'}</td>
          <td className={cnTable('Col')}>{'Commit message'}</td>
          <td className={cnTable('Col')}>{'Committer'}</td>
          <td className={cnTable('Col')}>{'Updated'}</td>
        </tr>
      </thead>
      <tbody>
        {!!path && (
          <tr className={cnTable('Line', [cnDivider()])}>
            <td className={cnTable('ColIcon')} />
            <td className={cnTable('Col', { nowrap: true })}>
              <Link
                to={makeSlug({
                  type: 'tree',
                  filename: '',
                  path: path
                    .split('/')
                    .slice(0, -1)
                    .join('/'),
                  repoId,
                  branch,
                })}
              >
                {'..'}
              </Link>
            </td>
            <td colSpan={4} />
          </tr>
        )}
        {files.map(
          ({ filename, type, hash, subject, committer, relativeDate }) => (
            <tr key={filename} className={cnTable('Line', [cnDivider()])}>
              <td className={cnTable('ColIcon')}>
                <FileIcon type={type} className={cnFileIcon({ type })} />
              </td>
              <td className={cnTable('Col', { nowrap: true })}>
                <Link to={makeSlug({ type, filename, path, repoId, branch })}>
                  {filename}
                </Link>
              </td>
              <td className={cnTable('Col')}>
                <CommitHash hash={hash} repoId={repoId} maxLength={6} />
              </td>
              <td className={cnTable('Col')}>{subject}</td>
              <td className={cnTable('Col')}>
                <User user={committer} />
              </td>
              <td className={cnTable('Col')}>{relativeDate}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

FileList.propTypes = {
  files: PropTypes.array.isRequired,
  className: PropTypes.string,
  path: PropTypes.string,
  repoId: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
};
