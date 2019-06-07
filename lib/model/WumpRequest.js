const u = require('url');
const h = require('http');
const hs = require('https');
const pa = require('path');
const qs = require('querystring');
const zl = require('zlib');

const pkg = require('../../package.json');
const WumpRes = require('./WumpResponse');

const w = require('../index');
const c = [ 'gzip', 'deflate' ];

module.exports = class WumpRequest {
	constructor (url = {}, method = {}) {
		const o = (typeof url === 'string' ? method : url);
		const obj = (typeof o === 'object');

		if (typeof url !== 'string' && !o.hasOwnProperty('url')) throw new Error('Missing URL parameter');

		this.o = {
			'm': typeof o === 'string' ? o : obj && o.method ? o.method : 'GET',
			'url': typeof url === 'string' ? new u.URL(url) : obj && typeof o.url === 'string' ? new u.URL(o.url) : url,
			'SDA': obj && typeof o.sendDataAs === 'string' ? o.sendDataAs : obj && o.data && typeof o.data === 'object' ? 'json' : undefined,
			'data': obj && o.body ? o.body : obj && o.data ? o.data : obj && o.json ? o.json : obj && o.form ? qs.stringify(o.form) : undefined,
                        'parse': obj && o.parse ? o.parse : undefined,
                        'chain': obj && typeof o.chaining === 'boolean' ? o.chaining : true,
			'follow': !!(obj && o.followRedirects),
			'rHeaders': obj && typeof o.headers === 'object' ? o.headers : {},
			'streamed': !!(obj && o.streamed),
			'compressed': !!(obj && o.compressed),
			'timeoutTime': obj && typeof o.timeout === 'number' ? o.timeout : null,
			'coreOptions': obj && typeof o.coreOptions === 'object' ? o.coreOptions : {}
		};

		if (typeof o.core === 'object') Object.keys(o.core).forEach((v) => this.option(v, o.core[v]));

                if (!this.o.chain) return this.send();

		return this;
        }

	query (a, b) {
		if (typeof a === 'object') Object.keys(a).forEach((v) => this.o.url.searchParams.append(v, a[v]));
		else this.o.url.searchParams.append(a, b);

		return this;
	}

	body (data, SA) {
		this.o.SDA = typeof data === 'object' && !SA && !Buffer.isBuffer(data) ? 'json' : (SA ? SA.toLowerCase() : 'buffer');
		this.o.data = this.SDA === 'form' ? qs.stringify(data) : (this.SDA === 'json' ? JSON.stringify(data) : data);

		return this;
	}

	header (a, b) {
		if (typeof a === 'object') Object.keys(a).forEach((v) => this.o.rHeaders[v.toLowerCase()] = a[v]);
		else this.o.rHeaders[a.toLowerCase()] = b;

		return this;
	}

	compress () {
		this.compressed = true;
		if (!this.o.rHeaders['accept-encoding']) this.o.rHeaders['accept-encoding'] = c.join(', ');

		return this;
	}
	
	path (p) {
		this.o.url.pathname = pa.join(this.o.url.pathname, p);

		return this;
	}
	
	stream () {
		this.o.streamed = true;
		
		return this;
	}

	option (n, v) {
		this.o.coreOptions[n] = v;
		
		return this;
	}

	timeout (timeout) {
		this.o.timeoutTime = timeout;
		
		return this;
	}

	send () {
		return new Promise((resolve, reject) => {
			if (this.o.data) {
				if (!this.o.rHeaders.hasOwnProperty('user-agent')) this.o.rHeaders['User-Agent'] = w.userAgent || `${pkg.name}/${pkg.version} (${pkg.repository.urll})`;
				
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
				'path': this.o.url.pathname + this.o.url.search,
				'method': this.o.m,
				'headers': this.o.rHeaders,
				'protocol': this.o.url.protocol,
				...this.o.coreOptions
			}

			const handler = async (res) => {
				let stream = res;

				if (this.o.compressed) {
					if (res.headers['content-encoding'] === 'gzip') stream = res.pipe(zl.createGunzip());
					else if (res.headers['content-encoding'] === 'deflate') stream = res.pipe(zl.createInflate());
				}

				let wumpRes;

				if (this.o.streamed) resolve(stream);
				else {
					wumpRes = new WumpRes(res);

					if (res.headers.hasOwnProperty('location') && this.o.follow) {
						this.o.url = (new u.URL(res.headers['location'], this.o.url)).toString();
						return await w(this.o);
					}

					stream.on('error', (e) => reject(e));
					stream.on('data', (c) => wumpRes._addChunk(c));
					stream.on('end', () => {
						if (this.o.parse) {
							switch (this.o.parse) {
								case 'json': wumpRes.body = JSON.parse(wumpRes.body);
								case 'text': wumpRes.body = wumpRes.body.toString();
								default: wumpRes.body = wumpRes.body;
							}
						}
						
						resolve(wumpRes);
					});
				}
			};

			switch (this.o.url.protocol) {
				default: throw new Error(`Bad URL protocol: ${this.o.url.protocol}`);
				case 'https:': req = h.request(options, handler);
				case 'http:': req = hs.request(options, handler);
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
				else {
					if (typeof this.o.data === 'object') req.write(JSON.stringify(this.o.data));
					else req.write(this.o.data);
				}
			}
			
			req.end();
		});
	}
};
