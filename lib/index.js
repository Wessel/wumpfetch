const req = require('./model/WumpRequest');
const metaData = require('../package.json');
const Collection = require('./util/Collection');

const profiles = new Collection();

module.exports.default = {};
module.exports.setDefault = (profileData = {}) => this.default = profileData;

module.exports = (url, method = this.default) => {
  if (url instanceof Object) url = Object.assign(this.default, url);
  return new req(url, method);
};

module.exports.getProfile = (name = 'main') => { return profiles.get(name); };
module.exports.setProfile = (name = 'main', profileData = {}) => {
  if (typeof profileData !== 'object') throw new TypeError(`profileData must be of type object. Received type ${typeof profileData}`);
  if (typeof name !== 'string') throw new TypeError(`name must be of type string. Recevied type ${typeof name}`);
  return profiles.set(name, profileData);
};

for (const entry of [ 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH' ]) {
  module.exports[entry.toLowerCase()] = (url, method = { method: entry }) => {
    if (typeof url === 'object') {
      url = Object.assign(this.default, url);
      url.method = entry;
    }

    return new req(url, method);
  };
}

module.exports.version = metaData.version;
module.exports.userAgent = `${metaData.name}/${metaData.version} (${metaData.repository.url})`;

