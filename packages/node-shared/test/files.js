const { Files } = require('../lib');

const files = new Files('./');

(async () => {
  const result = await files.getAllFiles();
  console.log(result);
})();
