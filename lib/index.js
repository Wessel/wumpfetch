const req = require('./model/WumpRequest');
const pkg = require('../package.json');

const common = [ 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH' ];

module.exports = (url, method) => {
  return new req(url, method);
};

common.forEach((v) => {
  module.exports[v.toLowerCase()] = (url, method) => {
    if (typeof url === 'string') return new req(url, { method: v, ...method });
    else return new req({ method: v, ...url }, method);
  }
});

module.exports.version = pkg.version;
module.exports.userAgent = `${pkg.name}/${pkg.version} (${pkg.repository.url})`;