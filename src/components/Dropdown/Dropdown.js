import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';

import { Popup } from 'components/Popup/Popup';
import { cnTypo } from 'components/Typo/Typo';

import './Dropdown.css';

export const cnDropdown = cn('Dropdown');

export const Dropdown = function({
  title,
  hideTitle,
  value,
  options,
  className,
  onChange,
}) {
  const [isOpen, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const buttonRef = useRef();

  const onClick = () => setOpen(isOpen => !isOpen);
  const onSelect = selectedOption => {
    setCurrentValue(selectedOption);
    onChange && onChange(selectedOption);
  };

  useEffect(() => {
    function onClickOutside(e) {
      if (isOpen && !buttonRef.current.contains(e.target)) {
        setOpen(isOpen => !isOpen);
      }
    }
    window.addEventListener('click', onClickOutside);
    return () => {
      window.removeEventListener('click', onClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cnDropdown(null, [className])}>
      <button
        className={cnDropdown('Button', { open: isOpen })}
        onClick={onClick}
        ref={buttonRef}
      >
        <span
          className={cnDropdown('Title', { hide: !!hideTitle }, [
            cnTypo({ weight: 'bold' }),
          ])}
        >
          {title}
        </span>{' '}
        <span className={cnDropdown('Current')}>{currentValue}</span>
      </button>
      {isOpen && (
        <Popup options={options} value={currentValue} onSelect={onSelect} />
      )}
    </div>
  );
};

Dropdown.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  hideTitle: PropTypes.bool,
  value: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
};
