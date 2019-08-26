module.exports = class WumpResponse {
  constructor (res) {
    this.body = Buffer.alloc(0);
    this.coreRes = res;
    this.headers = res.headers;
    this.statusCode = res.statusCode;
  }

  _addChunk (chunk) {
    this.body = Buffer.concat([ this.body, chunk ]);
  }

  parse () {
    if (this.headers['content-type'].includes('application/json')) return this.json();
    else return this.text();
  }

  text() { return this.body.toString(); }
  json() { return JSON.parse(this.body); }
  buffer() { return this.body; }
};
