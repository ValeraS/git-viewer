import React from 'react';
import { withBemMod } from '@bem-react/core';

import { cnLink, LinkProps } from './';

export interface LinkExternalProps {
  external?: 'true';
}

export const withLinkExternal = withBemMod<LinkExternalProps, LinkProps>(
  cnLink(),
  { external: true },
  () => ({ to, className, children }) => (
    <a href={to} className={cnLink(null, [className])}>
      {children}
    </a>
  )
);
