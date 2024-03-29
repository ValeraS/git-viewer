import PropTypes from 'prop-types';
import { compose } from '@bem-react/core';
import { Link as LocalLink } from './Link';
import { withLinkExternal } from './Link_external';
import { withLinkColorDefault } from './Link_color';

export const Link = compose(
  withLinkColorDefault,
  withLinkExternal
)(LocalLink);

Link.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  to: PropTypes.string.isRequired,
  external: PropTypes.bool,
  color: PropTypes.string,
};
