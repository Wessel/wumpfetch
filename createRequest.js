const { join } = require('path');

const common = [ 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH' ];
const request = require(join(__dirname, 'model', 'WumpRequest.js'));

module.exports = (url, method) => {
  return new request(url, method);
};

common.forEach((v) => {
  module.exports[v.toLowerCase()] = (url, method) => {
    return new request(url, Object.assign({ method: v }, method));
  }
});