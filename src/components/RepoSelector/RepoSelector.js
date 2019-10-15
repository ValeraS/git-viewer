import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '@bem-react/classname';

import { Dropdown } from 'components/Dropdown/Dropdown';
import { Popup } from 'components/Popup/Popup';

export const cnRepoSelector = cn('RepoSelector');

export const RepoSelector = function({ repos, repoId, className }) {
  const options = repos.map(repoId => ({
    value: repoId,
    label: repoId,
    to: `/${repoId}`,
  }));
  return (
    <Dropdown
      options={options}
      title="Repository"
      value={repoId}
      className={cnRepoSelector(null, [className])}
      renderContainer={props => <Popup {...props} />}
    />
  );
};

RepoSelector.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.string).isRequired,
  repoId: PropTypes.string,
  className: PropTypes.string,
};
