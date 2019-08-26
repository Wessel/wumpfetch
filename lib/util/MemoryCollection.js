module.exports = class MemoryCollection extends Map {
  constructor() {
    super();
  }

  filter(callback) {
    let result = [];
    for (const entry of Array.from(this.values())) {
      if (callback(entry)) result.push(entry);
    }

    return result;
  }

  map(callback) {
    let result = [];
    for (const value of Array.from(this.values())) {
      result.push(callback(value));
    }

    return result;
  }
};
