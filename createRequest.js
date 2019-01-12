const path = require( 'path' );

module.exports = ( url, method ) => { return new( require( path.join( __dirname, 'model', 'WumpRequest.js' ) ) )( url, method ); }