module.exports = class WumpResponse {
	constructor ( res ) {
		this.body    = Buffer.alloc( 0 );
		this.coreRes = res;

		this.headers = res.headers;
		this.statusCode = res.statusCode;
	}

	_addChunk ( chunk ) { this.body = Buffer.concat([ this.body, chunk ]); }

	text () { return this.body.toString(); }
	json () { return JSON.parse( this.body ); }
};