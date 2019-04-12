<img src="https://wessel.meek.moe/wumpfetch/logo.svg" align="left" width="180px" height="180px"/>
<img align="left" width="0" height="192px" hspace="10"/>

> <a href="https://github.com/PassTheWessel/wumpfetch">Wumpfetch</a> - A fast and easy to use HTTP client

[![MIT License](https://img.shields.io/badge/license-MIT-007EC7.svg?style=flat-square)](/LICENSE) [![Travis Build Status](https://img.shields.io/travis/com/PassTheWessel/wumpfetch.svg?style=flat-square)](https://travis-ci.com/PassTheWessel/wumpfetch)


Wumpfetch is a fast, lightweight and easy to use HTTP client for Node.JS. 

> [`Typings`](https://github.com/PassTheWessel/wumpfetch-typings) **|** [`GitHub`](https://github.com/PassTheWessel/wumpfetch) **|** [`NPM`](https://npmjs.com/package/wumpfetch)

<br>

## Installing
Wumpfetch can be installed with any package manager that supports the NPM registry, but the ones listed below are the most used ones.
```sh
$ yarn add wumpfetch # Install w/ Yarn
$ npm i wumpfetch # Install w/ NPM
```

## Example usage
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

#### Getting a response from a REST API
**Code**:
```js
const w = require('wumpfetch');

// Using an URL and custom options
;(async() => {
  let req = await w('https://aws.random.cat/meow', {
    chaining: false,
    headers: {
      'User-Agent': 'Project/0.0.1'
    }
  });
  // Only URL
  req = await w('https://aws.random.cat/meow', { chaining: false });
  // Only options
  req = await w({
    url: 'https://aws.random.cat/meow',
    chaining: false,
    headers: {
      'User-Agent': 'Project/0.0.1'
    }
  });
  
  console.log(req.json());
})();
```

**Result**:
```sh
$ node test.js
{ file: 'https://purr.objects-us-east-1.dream.io/i/100_-_rURSo7L.gif' }
```

#### Chaining methods
You can also chain methods by adding `chaining: true` to `options`
```js
const w = require('wumpfetch');

;(async() => {
	const r = await w('https://my-site.com/postboi', { method: 'POST' })
		.timeout(1000) // Set a 1s timeout
		.query('video', 'wumpboye') // Add a query
		.header({ 'Authorization': 'Pablito' }) // Set a header
		.body({ x: 'y', z: 1, beep: 'boop', chocolate: true }) // Send a JSON body
		.send(); // Finish the chain by sending the rquest

	console.log(r.json()); // Returns the response in a JSON format
})();
```

## Projects using Wumpfetch

> If you want your own project listed, either create a pull request or an issue with the following content:
> * Project name
> * a **short** description of your package
> 
> Also add the following if your project is a package/module/library:
> * NPM link (🔩)
> * Packagephobia link (⚖)
> * GitHub repository link (📂)
> * *Optional*: A website link (👾)

| Project Name | Short description | Links
|----------|----------|:-------------:
| boats.js | The official discord.boats API wrapper for NodeJS | [🔩](https://npmjs.com/package/boats.js) [⚖](https://packagephobia.now.sh/result?p=boats.js) [📂](https://github.com/DiscordBoats/boats.js) [👾](https://boats.js.org/?referrer=wumpfetch)
| qtradio.js | API wrapper for qtradio.moe made in JavaScript | [🔩](https://npmjs.com/package/qtradio.js) [⚖](https://packagephobia.now.sh/result?p=qtradio.js) [📂](https://github.com/auguwu/qtradio.js) [👾](https://qtradio.moe/?referrer=wumpfetch)
| cafebot.js | CafeBot.xyz API Wrapper made in JS  | [🔩](https://npmjs.com/package/cafebot.js) [⚖](https://packagephobia.now.sh/result?p=cafebot.js) [📂](https://github.com/DopeDealers/cafebot.js) [👾](https://cafebot.xyz/?referrer=wumpfetch)


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FPassTheWessel%2Fwumpfetch.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FPassTheWessel%2Fwumpfetch?ref=badge_large)
