const util = require('util');
const wump = require('../lib');

console.log(`Using wumpfetch v${wump.version} [${wump.userAgent}]\n\n`);

;(async() => {
  const requests = [
    await wump({ url: 'https://jsonplaceholder.typicode.com/todos/1', parse: 'json' }).send(),
    await wump('https://jsonplaceholder.typicode.com/todos/1', { chaining: false })
  ];

  console.log(`Test 1: \n${util.inspect(requests[0].body)}\n\n`);
  console.log(`Test 2: \n${util.inspect(requests[1].json())}\n\n`);
})();