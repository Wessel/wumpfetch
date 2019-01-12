const qs 			= require( 'querystring' );
const zlib    = require( 'zlib' );
const path    = require(  'path' );
const http    = require( 'http' );
const https   = require( 'https' );
const { URL } = require( 'url' );

const WumpResponse = require( path.join( __dirname, 'WumpResponse.js' ) );

const c = [ 'gzip', 'deflate' ];

module.exports = class WumpRequest {
	constructor ( url = {}, m = {} ) {
		const o   = typeof url === 'string' ? m : url;
		const obj = typeof o === 'object';

		this.m           = typeof o === 'string' ? o : obj && o.method ? o.method : 'GET';
		this.url         = typeof url === 'string' ? new URL( url ) : obj && typeof o.url === 'string' ? new URL( o.url ) : url;
		this.SDA         = obj && typeof o.sendDataAs === 'string' ? o.sendDataAs : null;
		this.data        = obj && o.data ? o.data : null;
		this.streamed    = obj && o.streamed ? true : false;
		this.compressed  = obj && o.compressed ? true : false;
		this.rHeaders    = obj && typeof o.headers === 'object' ? o.headers : {};
		this.timeoutTime = obj && typeof o.timeout === 'number' ? o.timeout : null;
		this.coreOptions = obj && typeof o.coreOptions === 'object' ? o.coreOptions : {};

		return this;
	}

	query ( a, b ) {
		if ( typeof a === 'object' ) Object.keys( a ).forEach( ( v ) => this.url.searchParams.append( v, a[ v ] ) );
		else this.url.searchParams.append( a, ab )

		return this;
	}

	body ( data, SA ) {
		this.SDA  = typeof data === 'object' && !SA && !Buffer.isBuffer( data ) ? 'json' : ( SA ? SA.toLowerCase() : 'buffer' );
		this.data = this.SDA === 'form' ? qs.stringify( data ) : ( this.SDA === 'json' ? JSON.stringify( data ) : data );

		return this;
	}

	header ( a, b ) {
		if (typeof a === 'object') Object.keys( a ).forEach( ( v ) => this.rHeaders[ v.toLowerCase() ] = a[ v ] );
		else this.rHeaders[ a.toLowerCase() ] = b;

		return this;
	}

	compress () {
		this.compressed = true
		if ( !this.rHeaders[ 'accept-encoding' ] ) this.rHeaders[ 'accept-encoding' ] = c.join( ', ' );

		return this;
	}
	
	path ( p ) { this.url.pathname = path.join( this.url.pathname, p ); return this; }
	stream () { this.streamed = true; return this; }
	option ( n, v ) { this.coreOptions[ n ] = v; return this; }
	timeout ( timeout ) { this.timeoutTime = timeout; return this; }

	send () {
		return new Promise( ( resolve, reject ) => {
			if ( this.data ) {
				if ( !this.rHeaders.hasOwnProperty( 'user-agent' ) ) this.rHeaders[ 'User-Agent' ] = 'wumpfetch/0.0.1 (https://github.com/PassTheWessel/wumpfetch)';
				
				if ( this.SDA === 'json' && !this.rHeaders.hasOwnProperty( 'content-type' ) ) this.rHeaders[ 'Content-Type' ] = 'application/json';
				if ( this.SDA === 'form') {
					if ( !this.rHeaders.hasOwnProperty( 'content-type' ) ) this.rHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
					if ( !this.rHeaders.hasOwnProperty( 'content-length' ) ) this.rHeaders[ 'Content-Length' ] = Buffer.byteLength( this.data );
				}
			}

			let req;
			const options = Object.assign({
				'host'		: this.url.hostname,
				'port'		: this.url.port,
				'path'    : this.url.pathname + this.url.search,
				'method'  : this.m,
				'headers' : this.rHeaders,
				'protocol': this.url.protocol
			}, this.coreOptions );

			const resHandler = ( res ) => {
				let stream = res;

				if ( this.compressed ) {
					if ( res.headers[ 'content-encoding' ] === 'gzip' ) stream = res.pipe( zlib.createGunzip() );
					else if ( res.headers[ 'content-encoding' ] === 'deflate' ) stream = res.pipe( zlib.createInflate() );
				}

				let wumpRes;

				if ( this.streamed ) resolve( stream );
				else {
					wumpRes = new WumpResponse( res );

					stream.on( 'error', ( e ) => reject( e ) );
					stream.on( 'data', ( c ) => wumpRes._addChunk( c ) )
					stream.on( 'end', () => resolve( wumpRes ) );
				}
			}

			if ( this.url.protocol === 'http:' ) req = http.request( options, resHandler );
			else if (this.url.protocol === 'https:') req = https.request( options, resHandler );
			else throw new Error( `Bad URL protocol: ${this.url.protocol}` );

			if ( this.timeoutTime ) {
				req.setTimeout( this.timeoutTime, () => {
					req.abort();
					if ( !this.streamed ) reject( new Error( 'Timeout reached' ) );
				});
			}

			req.on( 'error', ( e ) => reject( e ) );
			if ( this.data ) req.write( this.data );

			req.end();
		});
	}
}