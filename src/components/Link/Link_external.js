import React from 'react';
import { withBemMod } from '@bem-react/core';

import { cnLink } from './Link';

export const withLinkExternal = withBemMod(
  cnLink(),
  { external: true },
  () => ({ to, className, children }) => (
    <a href={to} className={cnLink(null, [className])}>
      {children}
    </a>
  )
);
