const fs = require('fs-extra');

// prepare to run tests by cleaning and getting the plugin setup
fs.removeSync('./test/out/');
fs.removeSync('./node_modules/typedoc-plugin-no-inherit/');
fs.copySync('./package.json', './node_modules/typedoc-plugin-no-inherit/package.json');
fs.copySync('./dist/', './node_modules/typedoc-plugin-no-inherit/');