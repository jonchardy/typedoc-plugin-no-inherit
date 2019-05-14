const fs = require('fs-extra');

// prepare to run tests by cleaning and getting the plugin setup
fs.removeSync('./test/out/');
fs.removeSync('./node_modules/typedoc-plugin-no-inherit/');
fs.copySync('./package.json', './node_modules/typedoc-plugin-no-inherit/package.json');
fs.copySync('./dist/', './node_modules/typedoc-plugin-no-inherit/');

// replace lib.es5.d.ts location based on root (different for Travis vs local)
const base = process.cwd().replace(/\\/g, '/');
fs.readFile('./test/specs/basic.json', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(
    /: ".*\/node_modules\/typescript\/lib\/lib\.es5\.d\.ts"/g,
    `: "${base}/node_modules/typescript/lib/lib.es5.d.ts"`);

  fs.writeFile('./test/specs/basic.json', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});