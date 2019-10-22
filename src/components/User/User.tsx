import React from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import './User.css';

export const cnUser = cn('User');

export interface UserProps extends IClassNameProps {
  user: string;
}

export const User: React.FC<UserProps> = function({ user, className }) {
  return <span className={cnUser(null, [className])}>{user}</span>;
};
