import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';
import { useComponentRegistry } from '@bem-react/di';

import { registryId } from 'components/App/App';
import { Dropdown } from 'components/Dropdown/Dropdown';
import { Popup } from 'components/Popup/Popup';

import { cnActiveElement } from 'components/ActiveElement/ActiveElement';
import { cnTypo } from 'components/Typo/Typo';

import { useSelector } from 'react-redux';
import { getRepos } from 'app-store/selectors/repos';
import { getRepo } from 'app-store/selectors/repo';
import { Link } from 'components/Link';

import './Header.css';

const cnHeader = cn('Header');

export const Header = function Header({ className }) {
  const repos = useSelector(getRepos);
  const { repoId } = useSelector(getRepo) || {};
  const options = repos.map(repoId => ({
    value: repoId,
    label: repoId,
    to: `/${repoId}`,
  }));
  const { Logo } = useComponentRegistry(registryId);
  return (
    <header className={cnHeader(null, [className])}>
      <Link to="/" className={cnHeader('Logo')}>
        <Logo />
      </Link>
      <div className={cnHeader('Content')}>
        <Dropdown
          options={options}
          title="Repository"
          value={repoId}
          className={cnTypo({ size: 'm' }, [cnActiveElement()])}
          renderContainer={props => <Popup {...props} />}
        />
      </div>
    </header>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};
