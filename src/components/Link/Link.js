import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouteLink } from 'react-router-dom';
import { cn } from '@bem-react/classname';

import './Link.css';

export const cnLink = cn('Link');

export const Link = function({ className, children, ...props }) {
  return (
    <RouteLink {...props} className={cnLink(null, [className])}>
      {children}
    </RouteLink>
  );
};

Link.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  to: PropTypes.string.isRequired,
};
