import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';
import { useComponentRegistry } from '@bem-react/di';

import { registryId } from 'components/App/App';
import { RepoSelector } from 'components/RepoSelector/RepoSelector';

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
  const { Logo } = useComponentRegistry(registryId);
  return (
    <header className={cnHeader(null, [className])}>
      <Link to="/" className={cnHeader('Logo')}>
        <Logo />
      </Link>
      <div className={cnHeader('Content')}>
        <RepoSelector
          repos={repos}
          repoId={repoId}
          className={cnTypo({ size: 'm' }, [cnActiveElement()])}
        />
      </div>
    </header>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};
