import { withBemMod } from '@bem-react/core';

import { cnLink } from './';

import './Link_color.css';

export interface LinkColorDefaultProps {
  color?: 'default';
}

export const withLinkColorDefault = withBemMod<LinkColorDefaultProps>(
  cnLink(),
  { color: 'default' }
);
