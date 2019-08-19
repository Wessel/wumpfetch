const req = require('./model/WumpRequest');
const metaData = require('../package.json');
const Collection = require('./util/Collection');

const profiles = new Collection();

module.exports = (url, method = this.defaults) => {
  if (url instanceof Object) url = Object.assign(this.defaults, url);
  return new req(url, method);
};

module.exports.defaults = {};
module.exports.addDefaults = (data = {}) => this.defaults = data;
module.exports.getProfile = (name = 'main') => profiles.get(name);
module.exports.setProfile = (name = 'main', data = {}) => {
  if (typeof data !== 'string') throw new TypeError(`Paramater "data" must be an Object. (received "${typeof data}")`);
  if (typeof name !== 'string') throw new TypeError(`Paramater "name" must be an String. (received "${typeof data}")`);
  profiles.set(name, data);
};

for (const entry of ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']) {
  module.exports[entry.toLowerCase()] = (url, method = { method: entry }) => {
    if (typeof url === 'object') {
      url = Object.assign(this.defaults, url);
      url.method = entry;
    }

    return new req(url, method);
  };
}

module.exports.version = metaData.version;
module.exports.userAgent = `${metaData.name}/${metaData.version} (${metaData.repository.url})`;