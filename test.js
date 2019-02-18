const w                   = require('./createRequest.js');
const { inspect }         = require('util');
const { register, start } = require('lumah');

register('Fetch a cat image', async (end) => {
	const r = await w({ url: 'https://aws.random.cat/meow', parse: 'json' }).send();
	end(r.statusCode === 200 ? true : false, r.statusCode === 200 ? inspect(r.body) : r.statusCode);
});

start();
