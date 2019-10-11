import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';

import './User.css';

export const cnUser = cn('User');

export const User = function({ user, className }) {
  return <span className={cnUser(null, [className])}>{user}</span>;
};

User.propTypes = {
  user: PropTypes.string,
  className: PropTypes.string,
};
