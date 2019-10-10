import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

class ErrorBoundaryBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      location: props.location,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  static getDerivedStateFromProps({ location }, prevState) {
    if (prevState.hasError && location.path !== prevState.location.path) {
      return {
        hasError: false,
        location,
      };
    }
    return null;
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong!</h1>;
    }
    return this.props.children;
  }
}

ErrorBoundaryBase.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object.isRequired,
};

export const ErrorBoundary = withRouter(ErrorBoundaryBase);
