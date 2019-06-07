const req = require('./model/WumpRequest');
const common = [ 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH' ];
const metaData = require('../package.json');

module.exports = (url, method) => { return new req(url, method); };

for (const method of common) {
  module.exports[method.toLowerCase()] = (url, method) => {
    if (typeof url === 'string') return new req(url, { method: method, ...method });
    else return new req({ method: method, ...url }, method);
  };
}

module.exports.version = metaData.version;
module.exports.userAgent = `${metaData.name}/${metaData.version} (${metaData.repository.url})`;