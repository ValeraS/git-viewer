import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { cnTypo } from 'components/Typo/Typo';

import './Dropdown.css';

export const cnDropdown = cn('Dropdown');

export interface Option {
  value: string;
  label: string;
  to: string;
}

export interface DropdownMenuProps extends IClassNameProps {
  options: Option[];
  currentValue?: string;
  onSelect?: (v: string) => void;
}

export interface DropdownProps extends IClassNameProps {
  title: string;
  hideTitle?: boolean;
  value?: string;
  defaultValue?: string;
  options: Option[];
  onChange?: (v: string) => void;
  renderContainer: React.FC<DropdownMenuProps>;
}

export const Dropdown: React.FC<DropdownProps> = function({
  title,
  hideTitle,
  value,
  defaultValue,
  options,
  className,
  onChange,
  renderContainer,
}) {
  const [isOpen, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(defaultValue);
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (typeof value !== 'undefined' && currentValue !== value) {
    setCurrentValue(value);
  }

  const onClick = () => setOpen(isOpen => !isOpen);
  const onSelect = (selectedOption: string) => {
    setCurrentValue(selectedOption);
    onChange && onChange(selectedOption);
  };

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (e.currentTarget instanceof HTMLElement) {
        if (
          isOpen &&
          buttonRef.current &&
          !buttonRef.current.contains(e.currentTarget)
        ) {
          setOpen(isOpen => !isOpen);
        }
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
      {isOpen &&
        renderContainer({
          options,
          currentValue,
          onSelect,
          className: cnDropdown('Container'),
        })}
    </div>
  );
};
