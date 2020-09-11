const fs = require('fs-extra');

// replace lib.es5.d.ts location based on root (different for Travis vs local)
const base = process.cwd().replace(/\\/g, '/');
fs.readFile('./test/specs/basic.json', 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(
    /: ".*\/node_modules\/typescript\/lib\/lib\.es5\.d\.ts"/g,
    `: "${base}/node_modules/typescript/lib/lib.es5.d.ts"`).replace(
    /: ".*\/test\/src\/basic\.ts"/g,
    `: "${base}/test/src/basic.ts"`
  );

  fs.writeFile('./test/specs/basic.json', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});