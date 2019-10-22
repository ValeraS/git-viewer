import React from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import './Icon.css';

export interface IconProps extends IClassNameProps {}
export const cnIcon = cn('Icon');

export const Icon: React.FC<IClassNameProps> = function({ className }) {
  return <span className={cnIcon(null, [className])} />;
};
