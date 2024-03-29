import debug from 'debug';
import { logging } from 'server/config';

const debugNamespaces = [];

export const error = debug('error');
error.log = console.error.bind(console);
debugNamespaces.push('error');

export const info = debug('info');
info.log = console.log.bind(console);

export const warn = debug('warn');
warn.log = console.warn.bind(console);

if (process.env.NODE_ENV !== 'production') {
  debugNamespaces.push('warn');
  if (logging.verbose) {
    debugNamespaces.push('info');
  }
}

debug.enable(debugNamespaces.join(','));

export default {
  error,
  info,
  warn,
};
