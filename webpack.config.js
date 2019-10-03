const serverConfig = require('./config/webpack/server.webpack.config');
const clientConfig = require('./config/webpack/client.webpack.config');

module.exports = (env = {}) => [serverConfig(env), clientConfig(env)];
