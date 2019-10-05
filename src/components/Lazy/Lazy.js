import * as React from 'react';

export function lazyComponent({ asyncLoader, syncLoader, id }) {
  const LazyComponent = props => {
    let componentModule = syncLoader();
    let Component;

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

export function lazyComponentBabel(loader) {
  if (typeof loader === 'function') {
    throw new Error('Add lazyComponentBabelPlugin to your babel config');
  }

  return lazyComponent(loader);
}
