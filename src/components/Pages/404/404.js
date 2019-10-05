import * as React from 'react';

import { cn } from '@bem-react/classname';

import 'components/Pages/404/404.css';

const page = cn('NotFoundPage');

export const NotFoundPage = function NotFoundPage() {
  return (
    <div className={page()}>
      <h1 className={page('Title')}>Page not found</h1>
    </div>
  );
};

export default NotFoundPage;
