const wump = require('../lib');
const util = require('util');

console.log(`Using wumpfetch v${wump.version} [${wump.userAgent}]`);

const profileData = {
  headers: {
    'Authorization': 'Wumper'
  }
};

wump.setProfile('main', profileData);
console.log(wump.getProfile('main'));

wump.setDefaults(profileData);
console.log(wump.getProfile('__default__'));

;(async () => {
  const req = await wump({ url: 'https://httpbin.org/get' }).send();

  console.log(`Test 1: \n${util.inspect(req.parse())}`);
})();
