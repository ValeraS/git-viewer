import React from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import './Tabs.css';
import { cnTypo } from 'components/Typo/Typo';
import { cnActiveElement } from 'components/ActiveElement/ActiveElement';
import { Link } from 'components/Link/Link';

export const cnTabs = cn('Tabs');

export interface TabsProps extends IClassNameProps {
  tabs: {
    tab: string;
    to: string;
  }[];
  activeTab: string;
}

export const Tabs: React.FC<TabsProps> = function({
  tabs,
  activeTab,
  className,
}) {
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
            className={cnTabs('Tab', { active: true }, [
              cnTypo({ weight: 'bold' }),
              cnTypo('Caps'),
            ])}
            key={tab}
          >
            <Link to={to}>{tab}</Link>
          </div>
        )
      )}
    </div>
  );
};
