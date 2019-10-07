import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';

import './Footer.css';
import { cnTypo } from 'components/Typo/Typo';
import { Link } from 'components/Link';

export const cnFooter = cn('Footer');

export const Footer = function({ className }) {
  return (
    <footer className={cnFooter(null, [className, cnTypo({ size: 'm' })])}>
      <div className={cnFooter('Content')}>
        Trade secrets of Yandex LLC. 16, Lev Tolstoy Str., Moscow, Russia,
        119021
      </div>
      <div className={cnFooter('Info')}>
        <div className={cnFooter('Version')}>UI: 0.1.15</div>
        <div className={cnFooter('Copyright')}>
          {'© 2007—2019 '}
          <Link
            to="https://yandex.ru"
            external={true}
            className={cnFooter('Link')}
          >
            Yandex
          </Link>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};
