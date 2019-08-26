const util = require('util');
const wump = require('../lib');

console.log(`Using wumpfetch v${wump.version} [${wump.userAgent}]`);

;(async() => {
  const requests = [
    await wump({ url: 'https://httpbin.org/get', parse: 'json' }).send(),
    await wump('https://httpbin.org/get', { chain: false }),
    await wump('https://httpbin.org/post', { chain: false, method: 'POST', body: { title: 'Wump', body: 'is cool', userId: 1 } })
  ];

  console.log(`Test 1: \n${util.inspect(requests[0].body)}\n`);
  console.log(`Test 2: \n${util.inspect(requests[1].json())}\n`);
  console.log(`Test 3: \n${util.inspect(requests[2].parse())}\n`);
})();
