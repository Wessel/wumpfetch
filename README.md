<img src="https://wessel.meek.moe/wumpfetch/logo.svg" align="left" width="180px" height="180px"/>
<img align="left" width="0" height="192px" hspace="10"/>

> <a href="https://github.com/PassTheWessel/wumpfetch">Wumpfetch</a> - A fast and easy to use HTTP client

[![MIT License](https://img.shields.io/badge/license-MIT-007EC7.svg?style=flat-square)](/LICENSE) [![Travis Build Status](https://img.shields.io/travis/com/PassTheWessel/wumpfetch.svg?style=flat-square)](https://travis-ci.com/PassTheWessel/wumpfetch)


Wumpfetch is a fast, lightweight and easy to use HTTP client for Node.JS. 

> [`GitHub`](https://github.com/PassTheWessel/wumpfetch) **|** [`NPM`](https://npmjs.com/package/wumpfetch)

<br>

## Installing
```sh
$ yarn add wumpfetch # Install w/ Yarn
$ npm i wumpfetch # Install w/ NPM
```

## Benchmarking
> **URL used for benchmarks**: [https://httpbin.org/get](https://httpbin.org/get)

| Library    | 1 Request | 10 Requests | 100 Requests |
|------------|-----------|-------------|--------------|
| Wumpfetch  | 429.571ms | 4135.043ms  | 42182.140ms  |
| got 		   | 420.319ms | 4163.749ms  | 43634.187ms  |
| axios      | 437.274ms | 4168.437ms  | 47437.898ms  |
| node-fetch | 543.618ms | 4217.365ms  | 43813.187ms  |

## Documentation
Documentation can be found at [https://github.com/PassTheWessel/wumpfetch/wiki](https://github.com/PassTheWessel/wumpfetch/wiki)

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FPassTheWessel%2Fwumpfetch.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FPassTheWessel%2Fwumpfetch?ref=badge_large)
