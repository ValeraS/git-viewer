import { match } from 'react-router';
import { Routes } from 'pages';

export interface RouterParams {
  repoId?: string;
  path?: string;
}

export interface RouterEvent extends match<RouterParams> {
  route: Routes;
}

export type RouterState = RouterEvent | undefined | null;
