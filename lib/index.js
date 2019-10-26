const req =              require('./model/WumpRequest');
const metaData =         require('../package.json');
const MemoryCollection = require('./util/MemoryCollection');

const profiles = new MemoryCollection();
profiles.set('__default__', { headers: { 'User-Agent': `${metaData.name}/${metaData.version} (${metaData.repository.url})` } });

const mergeDefaults = (opts) => {
  const defaults = profiles.get('__default__');
  Object.keys(defaults).forEach((key) => {
    if (!opts[key]) opts[key] = defaults[key];
  });

  return opts;
};

/**
 * Create a request with a specific method
 *
 * @param {object | string} url - The URL to send the request to or a `ReqOptions` object
 * @param {object | string} [method=profiles.__default__] - The method to use when sending the request or a `ReqOptions` object
 * @returns {req} - The request class
 */
module.exports = (url, method = profiles.get('__default__')) => {
  if (typeof url === 'object' && typeof method === 'string') url.method = method;
  if (typeof url === 'object' && !url.overwriteDefaults) url = mergeDefaults(url);
  if (typeof method === 'object' && !method.overwriteDefaults) method = mergeDefaults(method);

  return new req(url, method);
};

/**
 * Set the defaults for every request
 *
 * @param {object} [profileData={}] - The default request options to use
 * @returns {object} - The new defaults
 */
module.exports.setDefaults = (profileData = {}) => profiles.set('__default__', profileData);

/**
 * Get a profile that you've previously saved
 *
 * @param {string} [name=main] - The profile to get
 * @returns {object} - The profile if found
 */
module.exports.getProfile = (name = 'main') => { return profiles.get(name); };

/**
 * Save a profile globally
 *
 * @param {string} [name=main] - The profile's name, used to identify later on
 * @param {string} [profileData={}] - The profile's request data
 * @returns {object} - The newly added profile
 *
 */
module.exports.setProfile = (name = 'main', profileData = {}) => {
  if (typeof name !== 'string') throw new TypeError(`name must be of type string. Recevied type ${typeof name}`);
  if (typeof profileData !== 'object') throw new TypeError(`profileData must be of type object. Received type ${typeof profileData}`);
  profiles.set(name, profileData);
};

for (const entry of [ 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH' ]) {
  /**
   * Create a request with a specific method
   *
   * @param {object | string} url - The URL to send the request to or a `ReqOptions` object
   * @param {object | string} [method=profiles.__default__] - The method to use when sending the request or a `ReqOptions` object
   * @returns {req} - The request class
   */
  module.exports[entry.toLowerCase()] = (url, method = profiles.get('__default__')) => {
    if (typeof url === 'object' && !url.overwriteDefaults) Object.assign(url, profiles.get('__default__'));
    if (typeof method === 'object' && !method.overwriteDefaults) Object.assign(method, profiles.get('__default__'));

    if (typeof url === 'object') url.method = entry;
    if (typeof method === 'object') method.method = entry;

    return new req(url, method);
  };
}

/**
 * The current running version of wumpfetch
 */
module.exports.version = metaData.version;
/**
 * The default user-agent that's used when no user agent is provided
 * @readonly
 */
module.exports.userAgent = `${metaData.name}/${metaData.version} (${metaData.repository.url})`;
