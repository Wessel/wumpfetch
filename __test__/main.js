const util = require('util');
const wump = require('../lib');

console.log(`Using wumpfetch v${wump.version} [${wump.userAgent}]`);

;(async() => {
  const requests = [
    await wump({ url: 'https://jsonplaceholder.typicode.com/todos/1', parse: 'json' }).send(),
    await wump('https://jsonplaceholder.typicode.com/todos/1', { chain: false }),
    await wump('https://jsonplaceholder.typicode.com/posts', { chain: false, method: 'POST', body: { title: 'yeet', body: 'us', userId: 1 } })
  ];

  console.log(`Test 1: \n${util.inspect(requests[0].body)}\n`);
  console.log(`Test 2: \n${util.inspect(requests[1].json())}\n`);
  console.log(`Test 3: \n${util.inspect(requests[2].parse())}\n`);
})();