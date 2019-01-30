const http                            = require( 'http' );
const https                           = require( 'https' );
const { URL }                         = require( 'url' );
const { join }                        = require( 'path' );
const { stringify }                   = require( 'querystring' );
const { createGunzip, createInflate } = require( 'zlib' );

const WumpResponse = require( join( __dirname, 'WumpResponse.js' ) );

const w = require( join( __dirname, '..', 'createRequest.js' ) );
const c = [ 'gzip', 'deflate' ];

module.exports = class WumpRequest {
	constructor ( url = {}, m = {} ) {
		const o   = typeof url === 'string' ? m : url;
		const obj = typeof o === 'object';

		if ( typeof url !== 'string' && !o.hasOwnProperty( 'url' ) ) throw new Error( 'Missing url parameter' );

		this.o = {
			'm'           : typeof o === 'string' ? o : obj && o.method ? o.method : 'GET',
			'url'         : typeof url === 'string' ? new URL( url ) : obj && typeof o.url === 'string' ? new URL( o.url ) : url,
			'SDA'         : obj && typeof o.sendDataAs === 'string' ? o.sendDataAs : undefined,
			'data'        : obj && o.data ? o.data : obj && o.form ? stringify( o.form ) : undefined,
			'parse'       : obj && o.parse ? o.parse : undefined,
			'follow'      : !!( obj && o.followRedirects ),
			'streamed'    : !!( obj && o.streamed ),
			'compressed'  : !!( obj && o.compressed ),
			'rHeaders'    : obj && typeof o.headers === 'object' ? o.headers : {},
			'timeoutTime' : obj && typeof o.timeout === 'number' ? o.timeout : null,
			'coreOptions' : obj && typeof o.coreOptions === 'object' ? o.coreOptions : {}
		};

		if ( typeof o.core === 'object' ) Object.keys( o.core ).forEach( ( v ) => this.option( v, o.core[ v ] ) );

		return this;
	}

	query ( a, b ) {
		if ( typeof a === 'object' ) Object.keys( a ).forEach( ( v ) => this.o.url.searchParams.append( v, a[ v ] ) );
		else this.o.url.searchParams.append( a, b );

		return this;
	}

	body ( data, SA ) {
		this.o.SDA  = typeof data === 'object' && !SA && !Buffer.isBuffer( data ) ? 'json' : ( SA ? SA.toLowerCase() : 'buffer' );
		this.o.data = this.SDA === 'form' ? stringify( data ) : ( this.SDA === 'json' ? JSON.stringify( data ) : data );

		return this;
	}

	header ( a, b ) {
		if (typeof a === 'object') Object.keys( a ).forEach( ( v ) => this.o.rHeaders[ v.toLowerCase() ] = a[ v ] );
		else this.o.rHeaders[ a.toLowerCase() ] = b;

		return this;
	}

	compress () {
		this.compressed = true;
		if ( !this.o.rHeaders[ 'accept-encoding' ] ) this.o.rHeaders[ 'accept-encoding' ] = c.join( ', ' );

		return this;
	}
	
	path ( p ) { this.o.url.pathname = join( this.o.url.pathname, p ); return this; }
	stream () { this.o.streamed = true; return this; }
	option ( n, v ) { this.o.coreOptions[ n ] = v; return this; }
	timeout ( timeout ) { this.o.timeoutTime = timeout; return this; }

	send () {
		return new Promise( ( resolve, reject ) => {
			if ( this.o.data ) {
				if ( !this.o.rHeaders.hasOwnProperty( 'user-agent' ) ) this.o.rHeaders[ 'User-Agent' ] = 'wumpfetch/0.0.1 (https://github.com/PassTheWessel/wumpfetch)';
				
				if ( this.o.SDA === 'json' && !this.o.rHeaders.hasOwnProperty( 'content-type' ) ) this.o.rHeaders[ 'Content-Type' ] = 'application/json';
				if ( this.o.SDA === 'form') {
					if ( !this.o.rHeaders.hasOwnProperty( 'content-type' ) ) this.o.rHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
					if ( !this.o.rHeaders.hasOwnProperty( 'content-length' ) ) this.o.rHeaders[ 'Content-Length' ] = Buffer.byteLength( this.o.data );
				}
			}

			let req;
			const options = Object.assign({
				'host'		: this.o.url.hostname,
				'port'		: this.o.url.port,
				'path'    : this.o.url.pathname + this.o.url.search,
				'method'  : this.o.m,
				'headers' : this.o.rHeaders,
				'protocol': this.o.url.protocol
			}, this.o.coreOptions );

			const resHandler = async( res ) => {
				let stream = res;

				if ( this.o.compressed ) {
					if ( res.headers[ 'content-encoding' ] === 'gzip' ) stream = res.pipe( createGunzip() );
					else if ( res.headers[ 'content-encoding' ] === 'deflate' ) stream = res.pipe( createInflate() );
				}

				let wumpRes;

				if ( this.o.streamed ) resolve( stream );
				else {
					wumpRes = new WumpResponse( res );

					if ( res.headers.hasOwnProperty('location') && this.o.follow ) {
						this.o.url = ( new URL( res.headers[ 'location' ], this.o.url ) ).toString();
						return await w( this.o );
					}

					stream.on( 'error', ( e ) => reject( e ) );
					stream.on( 'data', ( c ) => wumpRes._addChunk( c ) );
					stream.on( 'end', () => {	
						if ( this.o.parse ) {
							if ( this.o.parse === 'json' ) wumpRes.body = JSON.parse( wumpRes.body );
							else if ( this.o.parse === 'text' ) wumpRes.body = wumpRes.body.toString();
							else wumpRes.body = wumpRes.body;
						}
						
						resolve( wumpRes );
					});
				}
			};

			if ( this.o.url.protocol === 'http:' ) req = http.request( options, resHandler );
			else if (this.o.url.protocol === 'https:') req = https.request( options, resHandler );
			else throw new Error( `Bad URL protocol: ${this.o.url.protocol}` );


			if ( this.o.timeoutTime ) {
				req.setTimeout( this.o.timeoutTime, () => {
					req.abort();
					if ( !this.o.streamed ) reject( new Error( 'Timeout reached' ) );
				});
			}

			req.on( 'error', ( e ) => reject( e ) );
			if ( this.o.data ) req.write( JSON.stringify( this.o.data ) );

			req.end();
		});
	}
};
