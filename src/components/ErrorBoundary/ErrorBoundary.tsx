import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Location } from 'history';

interface ErrorBoundaryBaseState {
  hasError: boolean;
  location: Location;
}

type ErrorBoundaryBaseProps = RouteComponentProps;

class ErrorBoundaryBase extends React.Component<
  RouteComponentProps,
  ErrorBoundaryBaseState
> {
  readonly state: ErrorBoundaryBaseState;

  constructor(props: ErrorBoundaryBaseProps) {
    super(props);
    this.state = {
      hasError: false,
      location: props.location,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  static getDerivedStateFromProps(
    { location }: ErrorBoundaryBaseProps,
    prevState: ErrorBoundaryBaseState
  ) {
    if (
      prevState.hasError &&
      location.pathname !== prevState.location.pathname
    ) {
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

export const ErrorBoundary = withRouter(ErrorBoundaryBase);
