const { resolve } = require('path');
const startServer = require('../dist/main').default;

startServer(resolve('./fixture'));
