# Wumpfetch
> A lightweight and fast Node.js HTTP client which can be used in various ways

> [GitHub](https://www.github.com/PassTheWessel/wumpfetch) **|** [NPM](https://www.npmjs.com/package/wumpfetch)

## Installing
```sh
$ yarn add wumpfetch # Install w/ Yarn (the superior package manager)
$ npm i wumpfetch # Install w/ NPM
```

## Usage
##### Code
```js
const w = require( 'wumpfetch' );

;( async() => {
	const r = await w( 'https://aws.random.cat/meow' ).send();

	console.log( r.json() );
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
		.timeout( 1000 ) // Set a 1s timeout
		.query('video', 'wumpboye') // Add a query
		.header({ 'Authorization': 'Pablito' }) // Set a header
		.body({ x: 'y', z: 1, beep: 'boop', chocolate: true }) // Send a json body
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
		headers: {
			'Authorization': 'Pablo'
		}
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

### Why should i use wumpfetch?
Wumpfetch is a lightweight and fast request library comparing to other packages such as request and node-fetch which are both around 1.5-4mb in size
<br />
[![install size](https://packagephobia.now.sh/badge?p=wumpfetch)](https://packagephobia.now.sh/result?p=wumpfetch) (6kb concatenated and 3.84kb minified, both in **/dest**)