const { join } = require('path');

module.exports = (url, method) => {
  return new(require(join( __dirname, 'model', 'WumpRequest.js')))(url, method);
};
