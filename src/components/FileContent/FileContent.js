import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';
import { cnDivider } from 'components/Divider/Divider';
import { cnTypo } from 'components/Typo/Typo';

import './FileContent.css';
import './FileLine.css';

export const cnFileContent = cn('FileContent');
export const cnFileLine = cn('FileLine');

export const FileContent = function({
  content,
  filename,
  fileSize = '100 bytes',
  className,
}) {
  return (
    <div className={cnFileContent(null, [className])}>
      <div
        className={cnFileContent('Head', [cnDivider(), cnTypo({ size: 'm' })])}
      >
        <div>
          <span className={cnFileContent('FileName')}>{filename}</span>
          <span className={cnFileContent('FileSize', [cnTypo({ size: 's' })])}>
            {fileSize}
          </span>
        </div>
        <button className={cnFileContent('Download', [cnTypo({ size: 'm' })])}>
          <span className="Icon Icon_img_download"></span>
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
