import * as React from 'react';

import { cn } from '@bem-react/classname';

import 'components/Pages/404/404.css';

export const cnNotFound = cn('NotFoundPage');

export const NotFoundPage = function NotFoundPage() {
  return (
    <div className={cnNotFound()}>
      <h1 className={cnNotFound('Title')}>Page not found</h1>
    </div>
  );
};

export default NotFoundPage;
