import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';
import { cnDivider } from 'components/Divider/Divider';
import { cnTypo } from 'components/Typo/Typo';
import {
  Icon as BaseIcon,
  withIconTypeDownload,
  withIconTypeBlob,
} from 'components/Icon';

import './FileContent.css';
import './FileLine.css';
import { compose, composeU } from '@bem-react/core';

export const cnFileContent = cn('FileContent');
export const cnFileLine = cn('FileLine');

const Icon = compose(composeU(withIconTypeBlob, withIconTypeDownload))(
  BaseIcon
);

export const FileContent = function({
  content,
  filename,
  fileSize = '(100 bytes)',
  className,
}) {
  return (
    <div className={cnFileContent(null, [className])}>
      <div
        className={cnFileContent('Head', [cnDivider(), cnTypo({ size: 'm' })])}
      >
        <div>
          <Icon type={'blob'} className={cnFileContent('FileIcon')} />
          <span className={cnFileContent('FileName')}>{filename}</span>
          <span className={cnFileContent('FileSize', [cnTypo({ size: 's' })])}>
            {fileSize}
          </span>
        </div>
        <button className={cnFileContent('Download', [cnTypo({ size: 'm' })])}>
          <Icon type={'download'} className={cnFileContent('DownloadIcon')} />
        </button>
      </div>
      <div className={cnFileContent('Content')}>
        <table className={cnTypo('Code')}>
          <tbody>
            {content.split('\n').map((line, index) => (
              <tr key={index} className={cnFileLine()}>
                <td className={cnFileLine('Num')}>{index + 1}</td>
                <td className={cnFileLine('Code')}>{line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

FileContent.propTypes = {
  content: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  fileSize: PropTypes.string,
  className: PropTypes.string,
};
