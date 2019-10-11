import { withBemMod } from '@bem-react/core';

import { cnLink } from './Link';

import './Link_color.css';

export const withLinkColorDefault = withBemMod(cnLink(), { color: 'default' });
