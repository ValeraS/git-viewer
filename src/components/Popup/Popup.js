import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';
import { Link } from 'components/Link';

import './Popup.css';

export const cnPopup = cn('Popup');

export const Popup = function({ className, options, onSelect }) {
  const onClick = e => {
    const selectedValue = e.target.dataset.value;
    onSelect && onSelect(selectedValue);
  };
  return (
    <ul className={cnPopup(null, [className])}>
      {options.map(({ value, label, to }) => (
        <li key={value} className={cnPopup('Option')}>
          <Link
            to={to}
            data-value={value}
            className={cnPopup('Link')}
            onClick={onClick}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

Popup.propTypes = {
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
      to: PropTypes.string,
    })
  ),
  currentValue: PropTypes.string,
  onSelect: PropTypes.func,
};
