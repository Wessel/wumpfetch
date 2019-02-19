const u = require('util');
const l = require('lumah');
const w = require('./createRequest.js');

console.log(w)

l.register('Fetch cat image A', async (end) => {
	const r = await w({ url: 'https://aws.random.cat/meow', parse: 'json' }).send();
	end(r.statusCode === 200 ? true : false, r.statusCode === 200 ? u.inspect(r.body) : r.statusCode);
});

l.register('Fetch cat image B', (end) => {
	w({ url: 'https://aws.random.cat/meow', parse: 'json' }).send().then((r) => {
		end(r.statusCode === 200 ? true : false, r.statusCode === 200 ? u.inspect(r.body) : r.statusCode)
	});
});

l.register('Fetch cat image C', async (end) => {
	const r = await w.get({ url: 'https://aws.random.cat/meow', parse: 'json' }).send();
	end(r.statusCode === 200 ? true : false, r.statusCode === 200 ? u.inspect(r.body) : r.statusCode);
});

l.start();