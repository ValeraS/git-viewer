import { withBemMod } from '@bem-react/core';
import { cnIcon } from './';

import './Icon_type_tree.css';

export interface IconTypeTreeProps {
  type?: 'tree';
}

export const withIconTypeTree = withBemMod<IconTypeTreeProps>(cnIcon(), {
  type: 'tree',
});
