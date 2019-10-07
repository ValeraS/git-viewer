import React from 'react';
import { withBemMod } from '@bem-react/core';

import { cnLink } from './Link';

export const withLinkExternal = withBemMod(
  cnLink(),
  { external: true },
  // eslint-disable-next-line no-unused-vars
  () => ({ to, className, children, external, ...props }) => (
    <a {...props} href={to} className={cnLink(null, [className])}>
      {children}
    </a>
  )
);
