/**
 * Download all death animations from nuclear throne
 *
 * @name Thronebutt-downloader
 * @author Wessel "wesselgame" T <discord@go2it.eu>
 * @license MIT
 */

// Check if node >= v8.0.0 is installed
if (Number(process.version.slice(1).split('.')[0]) < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');
// Declarations
const fs = require('fs');
const wump = require('../lib');
// Random string generator
const string = (iterations = 1, seed = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
  let text = '';
  
  if (typeof seed !== 'string' || seed.length <= 0 || typeof iterations !== 'number') return text;
  for (let i = 0; i < iterations; i++) text += seed.charAt(Math.floor(Math.random() * seed.length));

  return text;
};
// Set process values
process.name = 'Thronebutt';
process.hash = string(8);
// Define some basic stuff
const start = Date.now();
const settings = {
  entries  : 150,                                     // Times to loop
  baseURL  : 'https://thronebutt.com/img/deathflags', // BaseURL for images
  interval : 500,                                     // Interval inbetween every request
  fileType : 'gif',                                   // The file type to save as
  randomize: true                                     // Add a random 0-500ms to every interval
};
// Fetch `url` and save it to `dump/<index>.<fileType>`
const get = async(url, index) => {
  const req = await wump(url).send();
  if (req.statusCode !== 200) {
    return console.log(`[${process.name}] Failed on "${url}": ${req.statusCode}`)
  } else {
    fs.writeFileSync(`dump/${index}.${settings.fileType}`, req.body);
    console.log(`[${process.name}] Successfully copied "${url}" to "dump/${index}.${settings.fileType}" in ${Date.now() - start}ms from queue`);  
  } 
}
// Create the `dump` directory if it doesn't exist
fs.mkdir('dump', (err) => {
  if (err && err.code !== 'EEXIST') throw err;
});
// Loop `settings.entries` times and download the files
for (let i = 0; i < settings.entries; i++) {
  const interval = ((settings.interval + (settings.randomize ? Math.floor(Math.random() * 500) : 0)) * i);
  setTimeout(() => get(`${settings.baseURL}/${i}.${settings.fileType}`, i), interval)
}