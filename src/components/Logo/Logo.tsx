import React from 'react';
import { cn } from '@bem-react/classname';

import { Link } from 'components/Link';
import { IClassNameProps } from '@bem-react/core';

export const cnLogo = cn('Logo');

export interface LogoProps extends IClassNameProps {}

export const Logo: React.FC<LogoProps> = function({ className }) {
  return (
    <Link className={cnLogo(null, [className])} to="/">
      <img src="/assets/img/logo.svg" alt="Yandex Arcanum" />
    </Link>
  );
};
