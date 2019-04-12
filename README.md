# Wumpfetch
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FPassTheWessel%2Fwumpfetch.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FPassTheWessel%2Fwumpfetch?ref=badge_shield)

> A lightweight and fast Node.js HTTP client which can be used in various ways

> [Typings](https://github.com/PassTheWessel/wumpfetch-typings) **|** [GitHub](https://github.com/PassTheWessel/wumpfetch) **|** [NPM](https://npmjs.com/package/wumpfetch)

## Installing
```sh
$ yarn add wumpfetch # Install w/ Yarn (the superior package manager)
$ npm i wumpfetch # Install w/ NPM
```

## Usage
##### Code
```js
const w = require('wumpfetch');

;(async() => {
	const r = await w('https://aws.random.cat/meow').send();

	console.log(r.json());
});
```
##### Result
```sh
$ node test.js
{ file: 'https://purr.objects-us-east-1.dream.io/i/100_-_rURSo7L.gif' }
```

### Sending data in a JSON body to a server
#### Chaining methods
```js
const w = require('wumpfetch');

;(async() => {
	const r = await w('https://my-site.com/postboi', 'POST')
		.timeout(1000) // Set a 1s timeout
		.query('video', 'wumpboye') // Add a query
		.header({ 'Authorization': 'Pablito' }) // Set a header
		.body({ x: 'y', z: 1, beep: 'boop', chocolate: true }) // Send a JSON body
		.send(); // Finish the chain by sending the rquest

	console.log(r.json()); // Returns the response in a JSON format
})();
```
#### Object
```js
const w = require('wumpfetch');

;(async() => {
	const r = await w({
		url: 'https://my-site.com/postboi',
		data: { 'bear': 'cop' },
		method: 'POST',
		headers: { 'Authorization': 'Pablo' }
	});

	console.log(r.json());
})();
```
or
```js
const w = require('wumpfetch');

;(async() => {
	const r = await w('https://my-site.com/postboi', { method: 'GET' });
	console.log(r.json());
})();
```

## Projects using Wumpfetch

> If you want your own project listed, either create a pull request or an issue with the following content:
> * Package name
> * a **short** description of your package
> * NPM link (🔩)
> * Packagephobia link (⚖)
> * GitHub repository link (📂)
> * *Optional*: A website link (👾)

| Project Name | Short description | Links
|----------|----------|:-------------:
| boats.js | The official discord.boats API wrapper for NodeJS | [🔩](https://npmjs.com/package/boats.js) [⚖](https://packagephobia.now.sh/result?p=boats.js) [📂](https://github.com/DiscordBoats/boats.js) [👾](https://discord.boats/?referrer=wumpfetch)
| qtradio.js | API wrapper for qtradio.moe made in JavaScript | [🔩](https://npmjs.com/package/qtradio.js) [⚖](https://packagephobia.now.sh/result?p=qtradio.js) [📂](https://github.com/auguwu/qtradio.js) [👾](https://qtradio.moe/?referrer=wumpfetch)
| cafebot.js | CafeBot.xyz API Wrapper made in JS  | [🔩](https://npmjs.com/package/cafebot.js) [⚖](https://packagephobia.now.sh/result?p=cafebot.js) [📂](https://github.com/DopeDealers/cafebot.js) [👾](https://cafebot.xyz/?referrer=wumpfetch)


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FPassTheWessel%2Fwumpfetch.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FPassTheWessel%2Fwumpfetch?ref=badge_large)