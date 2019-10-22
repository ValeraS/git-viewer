import { Registry, withRegistry } from '@bem-react/di';
import { App as AppCommon, registryId } from './App';

import { Header } from 'components/Header/Header@desktop';
import { Footer } from 'components/Footer/Footer@desktop';
import { Logo } from 'components/Logo/Logo';

export const registry = new Registry({ id: registryId });

registry.set('Header', Header);
registry.set('Footer', Footer);
registry.set('Logo', Logo);

export const App = withRegistry(registry)(AppCommon);
