import wump from '../lib';
import util from 'util';

console.log(`Using wumpfetch v${wump.version} [${wump.userAgent}]`);

;(async() => {
  const requests = [
    await wump('https://httpbin.org/get', 'GET').send(),
    await wump('https://httpbin.org/get', { method: 'GET', chaining: false })
  ];

  console.log(`Test 1: \n${util.inspect(requests[0].parse())}\n`);
  console.log(`Test 2: \n${util.inspect(requests[1].json())}\n`);
})();
