const common = [ 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH' ];
const request = require('./model/WumpRequest');
const { version } = require('../package.json');

module.exports = (url, method) => {
  return new request(url, method);
};

common.forEach((v) => {
  module.exports[v.toLowerCase()] = (url, method) => {
    if (typeof url === 'string') {
      return new request(url, { method: v, ...method });
    } else {
      return new request({ method: v, ...url }, method);
    }
  }
});

module.exports.version = version;
module.exports.userAgent = `wumpfetch/${version} (https://github.com/PassTheWessel/wumpfetch)`;