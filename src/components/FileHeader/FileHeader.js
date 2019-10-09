import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';

import './FileHeader.css';
import { cnTypo } from 'components/Typo/Typo';
import { Dropdown } from 'components/Dropdown/Dropdown';
import { Popup } from 'components/Popup/Popup';

export const cnFileHeader = cn('FileHeader');

export const FileHeader = function({
  repo,
  branches,
  branch,
  path,
  className,
}) {
  const title = !path ? repo : path.split('/').slice(-1)[0];
  const branchOptions = branches.map(({ name }) => ({
    value: name,
    label: name,
    to: `/${repo}/tree/${name}/${path}`,
  }));

  return (
    <div className={cnFileHeader(null, [className])}>
      <h1 className={cnFileHeader('Title', [cnTypo({ size: 'xl' })])}>
        {title}
      </h1>
      <Dropdown
        className={cnTypo({ size: 'xl' })}
        title={'Branch'}
        hideTitle={true}
        value={branch}
        options={branchOptions}
        renderContainer={({ className, ...props }) => (
          <Popup {...props} className={cnTypo({ size: 'm' }, [className])} />
        )}
      />
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
