import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';

import './Tabs.css';
import { cnTypo } from 'components/Typo/Typo';
import { cnActiveElement } from 'components/ActiveElement/ActiveElement';
import { Link } from 'components/Link/Link';

export const cnTabs = cn('Tabs');

export const Tabs = function({ tabs, activeTab, className }) {
  return (
    <div className={cnTabs(null, [className])}>
      {tabs.map(({ tab, to }) =>
        tab === activeTab ? (
          <div
            className={cnTabs('Tab', [
              cnTypo({ weight: 'bold' }),
              cnTypo('Caps'),
              cnActiveElement(),
            ])}
            key={tab}
          >
            {tab}
          </div>
        ) : (
          <div
            className={cnTabs('Tab', [
              cnTypo({ weight: 'bold' }),
              cnTypo('Caps'),
            ])}
            key={tab}
          >
            <Link to={to} className={cnTabs('Link')}>
              {tab}
            </Link>
          </div>
        )
      )}
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tab: PropTypes.string,
      to: PropTypes.string,
    })
  ).isRequired,
  activeTab: PropTypes.string,
  className: PropTypes.any,
};
