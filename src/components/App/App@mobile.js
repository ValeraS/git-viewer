import { Registry, withRegistry } from '@bem-react/di';
import { App as AppCommon, registryId } from './App';

import { Header } from 'components/Header/Header@mobile';
import { Footer } from 'components/Footer/Footer@mobile';

export const registry = new Registry({ id: registryId });

registry.set('Header', Header);
registry.set('Footer', Footer);

export const App = withRegistry(registry)(AppCommon);
