const zlib = require('zlib');
const http = require('http');
const https = require('https');
const { URL } = require('url');
const { stringify } = require('querystring');
const { join: pJoin } = require('path');

const w = require('../index');
const WumpRes = require('./WumpResponse');
const metaData = require('../../package.json');
const compressions = [ 'gzip', 'deflate' ];


module.exports = class WumpRequest {
	constructor (url = {}, method = {}) {
		const o = (typeof url === 'string' ? method : url);

		if (typeof url !== 'string' && !o.hasOwnProperty('url')) throw new Error('Missing URL parameter');

		this.o = {
			'm': typeof o === 'string' ? o : (o.method || 'GET'),
			'url': typeof url === 'string' ? new URL(url) : typeof o.url === 'string' ? new URL(o.url) : url,
			'SDA': typeof o.sendDataAs === 'string' ? o.sendDataAs : o.data && typeof o.data === 'object' ? 'json' : undefined,
			'data': o.body || o.data || o.json || (o.form ? stringify(o.form) : undefined),
      'parse': o.parse,
      'chain': typeof o.chain === 'boolean' ? o.chain : true,
			'follow': !!(o.followRedirects),
			'rHeaders': typeof o.headers === 'object' ? o.headers : {},
			'streamed': !!(o.streamed),
			'compressed': !!(o.compressed),
			'timeoutTime': typeof o.timeout === 'number' ? o.timeout : null,
			'coreOptions': typeof o.coreOptions === 'object' ? o.coreOptions : {}
		};

		if (typeof o.core === 'object') for (const key of Object.keys(o.core)) this.option(key, o.core[key]);
    if (!this.o.chain) return this.send();

		return this;
  }

	query (name, value) {
		if (typeof a === 'object') for (const key of Object.keys(name)) this.o.url.searchParams.append(key, name[key]);
		else this.o.url.searchParams.append(name, value);

		return this;
	}

	body (data, sendAs) {
		this.o.SDA = typeof data === 'object' && !sendAs && !Buffer.isBuffer(data) ? 'json' : sendAs ? sendAs.toLowerCase() : 'buffer';
		this.o.data = this.sendAs === 'form' ? stringify(data) : this.SDA === 'json' ? JSON.stringify(data) : data;

		return this;
	}

	header (name, value) {
		if (typeof name === 'object') for (const key of Object.keys(name)) this.o.rHeaders[key.toLowerCase()] = name[key];
		else this.o.rHeaders[name.toLowerCase()] = value;

		return this;
	}

	compress () {
		this.compressed = true;
		if (!this.o.rHeaders['accept-encoding']) this.o.rHeaders['accept-encoding'] = compressions.join(', ');

		return this;
	}
	
	path (p) {
		this.o.url.pathname = pJoin(this.o.url.pathname, p);

		return this;
	}
	
	stream () {
		this.o.streamed = true;
		
		return this;
	}

	option (name, value) {
		this.o.coreOptions[name] = value;
		
		return this;
	}
	timeout (timeout = 0) {
		this.o.timeoutTime = timeout;
		
		return this;
	}

	send () {
		return new Promise((resolve, reject) => {
			if (this.o.data) {
				if (!this.o.rHeaders.hasOwnProperty('user-agent')) this.o.rHeaders['User-Agent'] = w.userAgent || `${metaData.name}/${metaData.version} (${metaData.repository.url})`;
				
				if (this.o.SDA === 'json' && !this.o.rHeaders.hasOwnProperty('content-type')) this.o.rHeaders['Content-Type'] = 'application/json';
				if (this.o.SDA === 'form') {
					if (!this.o.rHeaders.hasOwnProperty('content-type')) this.o.rHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
					if (!this.o.rHeaders.hasOwnProperty('content-length')) this.o.rHeaders['Content-Length'] = Buffer.byteLength(this.o.data);
				}
			}

			let req;
			const options = {
				'host': this.o.url.hostname,
				'port': this.o.url.port,
				'path': `${this.o.url.pathname}${this.o.url.search}`,
				'method': this.o.m,
				'headers': this.o.rHeaders,
				'protocol': this.o.url.protocol,
				...this.o.coreOptions
			};

			const handler = async (res) => {
				let stream = res;

				if (this.o.compressed) {
          switch (res.headers['content-encoding']) {
            case 'gzip': stream = res.pipe(zlib.createGunzip()); break;
            case 'defalte': stream = res.pipe(zlib.createInflate()); break;
          }
				}

				let wumpRes;

				if (this.o.streamed) resolve(stream);
				else {
					wumpRes = new WumpRes(res);

					if (res.headers.hasOwnProperty('location') && this.o.follow) {
						this.o.url = (new URL(res.headers['location'], this.o.url)).toString();
						return await w(this.o);
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
        case 'http:': req = http.request(options, handler); break;
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
