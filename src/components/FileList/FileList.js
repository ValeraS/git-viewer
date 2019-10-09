import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';
import { cnTypo } from 'components/Typo/Typo';
import { cnDivider } from 'components/Divider/Divider';
import { cnTable } from 'components/Table/Table';
import { Link } from 'components/Link';
import { CommitHash } from 'components/CommitHash/CommitHash';

import 'components/Table/Table.css';

export const cnFileList = cn('FileList');
export const cnFileIcon = cn('FileIcon');

const columns = [
  'Name',
  'Last Commit',
  'Commit message',
  'Committer',
  'Updated',
];

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
          {columns.map(name => (
            <td key={name} className={cnTable('Col')}>
              {name}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {!!path && (
          <tr className={cnTable('Line', [cnDivider()])}>
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
        {files.map(({ filename, type, hash, subject, committer, date }) => (
          <tr key={filename} className={cnTable('Line', [cnDivider()])}>
            <td className={cnTable('Col', { nowrap: true })}>
              <Link
                to={makeSlug({ type, filename, path, repoId, branch })}
                className={cnFileIcon({ type })}
              >
                {filename}
              </Link>
            </td>
            <td className={cnTable('Col')}>
              <CommitHash hash={hash} repoId={repoId} maxLength={6} />
            </td>
            <td className={cnTable('Col')}>{subject}</td>
            <td className={cnTable('Col')}>{committer}</td>
            <td className={cnTable('Col')}>{date}</td>
          </tr>
        ))}
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
