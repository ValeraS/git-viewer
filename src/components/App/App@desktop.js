import { Registry, withRegistry } from '@bem-react/di';
import { App as AppCommon, registryId } from 'components/App/App';

import { Header } from 'components/Header/Header@desktop';
import { Footer } from 'components/Footer/Footer@desktop';

export const registry = new Registry({ id: registryId });

registry.set('Header', Header);
registry.set('Footer', Footer);

export const App = withRegistry(registry)(AppCommon);
