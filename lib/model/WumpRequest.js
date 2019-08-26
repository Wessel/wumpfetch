const zlib =            require('zlib');
const http =            require('http');
const https =           require('https');
const { URL } =         require('url');
const { stringify } =   require('querystring');
const { join: pJoin } = require('path');

const wump = require('../index');
const WumpRes = require('./WumpResponse');
const metaData = require('../../package.json');
const compressions = [ 'gzip', 'deflate' ];

module.exports = class WumpRequest {
  /**
   * Create the initial request
   *
   * @param {object | string} [url={}] - The URL to send the request to or a `ReqOptions` object
   * @param {object | string} [method={}] - The method to use when sending the request or a `ReqOptions` object
   * @throws {Error} - Missing URL parameter
   * @returns {WumpRequest} - The request class
   */
  constructor (url = {}, method = {}) {
    const options = (typeof url === 'string' ? method : url);

    if (typeof url !== 'string' && !options.hasOwnProperty('url')) throw new Error('Missing URL parameter');
    this.o = {
      'm': typeof method === 'string' ? method : (options.method || 'GET'),
      'url': typeof url === 'string' ? new URL(url) : typeof options.url === 'string' ? new URL(options.url) : url,
      'SDA': typeof options.sendDataAs === 'string' ? options.sendDataAs : options.data && typeof options.data === 'object' ? 'json' : undefined,
      'data': options.body || options.data || options.json || (options.form ? stringify(options.form) : undefined),
      'parse': options.parse,
      'chain': typeof options.chain === 'boolean' ? options.chain : true,
      'follow': !!(options.followRedirects),
      'rHeaders': typeof options.headers === 'object' ? options.headers : {},
      'streamed': !!(options.streamed),
      'compressed': !!(options.compressed),
      'timeoutTime': typeof options.timeout === 'number' ? options.timeout : null,
      'coreOptions': typeof options.coreOptions === 'object' ? options.coreOptions : {}
		};

    if (typeof options.coreOptions === 'object') {
      for (const key of Object.keys(options.coreOptions)) {
        this.option(key, options.coreOptions[key]);
      }
    }

    if (!this.o.chain) {
      return this.send();
    }

		return this;
  }

  /**
   * Append the request's body
   *
   * @param {any} data - The data to append
   * @param {string} sendAs - The way to send the data, either `json`, `form` or `buffer`
   * @returns {WumpRequest} - The request class
   */
  body(data, sendAs) {
    this.o.SDA = typeof data === 'object' && !sendAs && !Buffer.isBuffer(data) ? 'json' : sendAs ? sendAs.toLowerCase() : 'buffer';
    this.o.data = this.sendAs === 'form' ? stringify(data) : this.SDA === 'json' ? JSON.stringify(data) : data;

    return this;
  }

  /**
   * Update the path of the URL (protocol://url.domain/:path)
   *
   * @param {string} path - The path to append to the url
   * @returns {WumpRequest} - The request class
   */
  path(path) {
    this.o.url.pathname = pJoin(this.o.url.pathname, path);

    return this;
  }

  /**
   * Append the request's URL with a query (?name=value)
   *
   * @param {object | string} name - The name of the query or an object with multiple queries
   * @param {string} value - The value of the query if `name` is of type `string`
   * @returns {WumpRequest} - The request class
   */
	query (name, value) {
		if (typeof name === 'object') {
      for (const key of Object.keys(name)) {
        this.o.url.searchParams.append(key, name[key]);
      }
    } else this.o.url.searchParams.append(name, value);

		return this;
	}

  /**
   *
   * @param {string | object} name - The name of the header or an object containing multiple headers
   * @param {string} value - The content of the header if `name` is type of `string`
   * @returns {WumpRequest} - The request class
   */
	header (name, value) {
		if (typeof name === 'object') {
      for (const key of Object.keys(name)) {
        this.o.rHeaders[key.toLowerCase()] = name[key];
      }
    } else this.o.rHeaders[name.toLowerCase()] = value;

		return this;
	}

  /**
   * Change one of NodeJS' `http` library options
   *
   * @param {string} name - The name of the option
   * @param {any} value - The value of the optiob
   * @returns {WumpRequest} - The request class
   */
  option(name, value) {
    this.o.coreOptions[name] = value;

    return this;
  }

  /**
   * Add a request timeout
   *
   * @param {number} timeout - The time before timing out (ms)
   * @returns {WumpRequest} - The request class
   */
  timeout(timeout = 0) {
    this.o.timeoutTime = timeout;

    return this;
  }

  /**
   * Keep a connection alive with the server
   *
   * @returns {WumpRequest} - The request class
   */
  stream() {
    this.o.streamed = true;

    return this;
  }

  /**
   * Accept all encodings from the server
   *
   * @returns {WumpRequest} - The request class
   */
  compress() {
    this.compressed = true;
    if (!this.o.rHeaders['accept-encoding']) this.o.rHeaders['accept-encoding'] = compressions.join(', ');

    return this;
  }

  /**
   * Finish off the request by sending it to the specified URL
   *
   * @throws {Error} - Bad URL Protocol
   * @throws {Error} - Timeout reached
   * @returns {Promise} - Teh response data
   */
	send () {
		return new Promise((resolve, reject) => {
			if (this.o.data) {
				if (!this.o.rHeaders.hasOwnProperty('user-agent')) this.o.rHeaders['User-Agent'] = `${metaData.name}/${metaData.version} (${metaData.repository.url})`;

				if (this.o.SDA === 'json' && !this.o.rHeaders.hasOwnProperty('content-type')) this.o.rHeaders['Content-Type'] = 'application/json';
				if (this.o.SDA === 'form') {
					if (!this.o.rHeaders.hasOwnProperty('content-type')) this.o.rHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
					if (!this.o.rHeaders.hasOwnProperty('content-length')) this.o.rHeaders['Content-Length'] = Buffer.byteLength(this.o.data);
				}
			}

			let req;
			const options = {
				'host':     this.o.url.hostname,
				'port':     this.o.url.port,
				'path':     `${this.o.url.pathname}${this.o.url.search}`,
				'method':   this.o.m,
				'headers':  this.o.rHeaders,
				'protocol': this.o.url.protocol,
				...this.o.coreOptions
			};

			const handler = async (res) => {
				let stream = res;

				if (this.o.compressed) {
          switch (res.headers['content-encoding']) {
            case 'gzip':    stream = res.pipe(zlib.createGunzip()); break;
            case 'defalte': stream = res.pipe(zlib.createInflate()); break;
          }
				}

				let wumpRes;

				if (this.o.streamed) {
          resolve(stream);
        } else {
					wumpRes = new WumpRes(res);

					if (res.headers.hasOwnProperty('location') && this.o.follow) {
						this.o.url = (new URL(res.headers['location'], this.o.url)).toString();
						return await wump(this.o);
					}

					stream.on('error', (e) => reject(e));
					stream.on('data', (c) => wumpRes._addChunk(c));
					stream.on('end', () => {
						if (this.o.parse) {
              switch (this.o.parse) {
                case 'json': wumpRes.body = JSON.parse(wumpRes.body); break;
                case 'text': wumpRes.body = wumpRes.body.toString(); break;
                default: wumpRes.body = wumpRes.body;
              }
						}

						resolve(wumpRes);
					});
				}
			};

      switch (this.o.url.protocol) {
        case 'http:':  req = http.request(options, handler); break;
        case 'https:': req = https.request(options, handler); break;
        default: throw new Error(`Bad URL protocol: ${this.o.url.protocol}`);
      }

			if (this.o.timeoutTime) {
				req.setTimeout(this.o.timeoutTime, () => {
					req.abort();
					if (!this.o.streamed) reject(new Error('Timeout reached'));
				});
			}

			req.on('error', (e) => reject(e));

			if (this.o.data) {
				if (this.o.SDA === 'json') req.write(JSON.stringify(this.o.data));
				else if (this.o.data instanceof Object) req.write(JSON.stringify(this.o.data));
				else req.write(this.o.data);
			}

			req.end();
		});
	}
};
