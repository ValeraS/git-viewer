import { withBemMod } from '@bem-react/core';
import { cnIcon } from './';

import './Icon_type_download.css';

export interface IconTypeDownloadProps {
  type?: 'download';
}

export const withIconTypeDownload = withBemMod<IconTypeDownloadProps>(cnIcon(), { type: 'download' });
