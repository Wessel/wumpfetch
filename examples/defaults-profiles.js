/**
 * Mini examples of how to declare `defaults` or `profiles`.
 * 
 * @name DefaultsProfiles
 * @author August <augu@voided.pw>
 * @license MIT
 */

if (Number(process.version.slice(1).split('.')[0]) < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

const w = require('../lib');

process.name = 'Defaults or Profiles';
process.hash = String(8);

// mmm
w.addDefaults({
    headers: {
        'User-Agent': w.userAgent
    }
});

const get = async() => {
    const req = await w({
        url: 'https://api.augu.dev/webhook/boats',
        method: 'GET'
    }).send();
    const data = req.json();
    console.log(require('util').inspect(data));
};

get();