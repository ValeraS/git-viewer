import React from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { cn } from '@bem-react/classname';

import './Link.css';
import { IClassNameProps } from '@bem-react/core';

export const cnLink = cn('Link');

export interface LinkProps extends IClassNameProps {
  to: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const Link: React.FC<LinkProps> = function({
  className,
  children,
  ...props
}) {
  return (
    <RouteLink {...props} className={cnLink(null, [className])}>
      {children}
    </RouteLink>
  );
};
