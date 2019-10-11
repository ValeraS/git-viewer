import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';

import './Icon.css';

export const cnIcon = cn('Icon');

export const Icon = function({ className }) {
  return <span className={cnIcon(null, [className])} />;
};

Icon.propTypes = {
  className: PropTypes.string,
};
