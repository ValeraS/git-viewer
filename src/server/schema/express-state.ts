import { AppState } from 'app-store';

export interface ExpressState {
    state: AppState;

    files: Record<string, string>;
    css: string[];
    js: string[];
}