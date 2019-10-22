import React from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { Dropdown } from 'components/Dropdown/Dropdown';
import { Popup } from 'components/Popup/Popup';
import { cnTypo } from 'components/Typo/Typo';

import './BranchSelector.css';

export const cnBranchSelector = cn('BranchSelector');

export interface BranchSelectorProps extends IClassNameProps {
  repoId: string;
  branches: { name: string }[];
  branch: string;
  path: string;
}

export const BranchSelector: React.FC<BranchSelectorProps> = function({
  repoId,
  branches,
  branch,
  path,
  className,
}) {
  const branchOptions = branches.map(({ name }) => ({
    value: name,
    label: name,
    to: `/${repoId}/tree/${name}/${path}`,
  }));
  return (
    <Dropdown
      className={cnBranchSelector(null, [className, cnTypo({ size: 'xl' })])}
      title={'Branch'}
      hideTitle={true}
      value={branch}
      options={branchOptions}
      renderContainer={({ className, ...props }) => (
        <Popup {...props} className={cnTypo({ size: 'm' }, [className])} />
      )}
    />
  );
};
