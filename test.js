const u = require('util');
const l = require('lumah');
const w = require('./createRequest.js');

l.register('Fetch a cat image', async (end) => {
	const r = await w({ url: 'https://aws.random.cat/meow', parse: 'json' }).send();
	end(r.statusCode === 200 ? true : false, r.statusCode === 200 ? u.inspect(r.body) : r.statusCode);
});

l.start();