const w = require( './createRequest' );

;( async() => {
	const r = await w( { url: 'https://aws.random.cat/meow' } ).send();
	console.log( r.json() )
})();
