import { withBemMod } from '@bem-react/core';
import { cnIcon } from './';

import './Icon_type_blob.css';

export interface IconTypeBlobProps {
  type?: 'blob';
}

export const withIconTypeBlob = withBemMod<IconTypeBlobProps>(cnIcon(), {
  type: 'blob',
});
