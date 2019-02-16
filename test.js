const w = require('./createRequest.js');

;( async() => {
	const r = await w({ url: 'https://aws.random.cat/meow', parse: 'json' }).send();
	console.log(r.body);
})();
