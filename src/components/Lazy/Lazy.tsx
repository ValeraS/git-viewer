import React from 'react';
import { RouteComponentProps } from 'react-router';
import { RouterParams } from 'app-store/router/types';

interface LazyModule {
  default: React.ComponentType<RouteComponentProps<RouterParams>>;
}

export type LazyComponentType = React.ComponentType<
  RouteComponentProps<RouterParams>
> & {
  load(): Promise<LazyModule>;
};

export interface LazyProps {
  asyncLoader(): Promise<LazyModule>;

  syncLoader(): LazyModule | undefined;

  id: string;
}

export function lazyComponent({
  asyncLoader,
  syncLoader,
  id,
}: LazyProps): LazyComponentType {
  const LazyComponent = (props: RouteComponentProps<RouterParams>) => {
    const componentModule = syncLoader();
    let Component:
      | React.ComponentType<RouteComponentProps<RouterParams>>
      | undefined;

    // Server
    if (componentModule) {
      Component = componentModule.default;
    } else {
      // Have preloaded module and make component sync
      if (require.cache[id]) {
        Component = require.cache[id].exports.default;
      } else {
        Component = React.lazy(asyncLoader);
      }
    }

    if (!Component) {
      throw new Error('Cannot load component');
    }

    return <Component {...props} />;
  };

  LazyComponent.load = asyncLoader;

  return LazyComponent;
}

export function lazyComponentBabel(
  loader: (() => Promise<LazyModule>) | LazyProps
) {
  if (typeof loader === 'function') {
    throw new Error('Add lazyComponentBabelPlugin to your babel config');
  }

  return lazyComponent(loader);
}
