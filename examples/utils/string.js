module.exports = (iterations = 1, seed = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
  let text = '';

  if (typeof seed !== 'string' || seed.length <= 0 || typeof iterations !== 'number') return text;
  for (let i = 0; i < iterations; i++) {
    text += seed.charAt(Math.floor(Math.random() * seed.length));
  }

  return text;
};
