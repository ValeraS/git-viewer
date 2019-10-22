import React, { MouseEventHandler } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { Link } from 'components/Link';

import './Popup.css';

export const cnPopup = cn('Popup');

export interface PopupProps extends IClassNameProps {
  options: {
    value: string;
    label: string;
    to: string;
  }[];
  currentValue?: string;
  onSelect?: (v?: string) => void;
}

export const Popup:React.FC<PopupProps>  = function({ className, options, onSelect }) {
  const onClick: MouseEventHandler<HTMLAnchorElement> = e => {
    const selectedValue = e.currentTarget.dataset.value;
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

