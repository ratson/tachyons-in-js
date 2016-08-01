const request = require('request-promise');
const fs = require('fs');
const nativeCSS = require('native-css');
const R = require('ramda');

const tachyonsModules = require('tachyons-modules');

const moduleBlacklist = [
  'react-native-style-tachyons',
  'tachyons-base',
  'tachyons-build-css',
  'tachyons-display-verbose',
  'tachyons-verbose',
  'tachyons-webpack',
];

function concatMediaQueries (key, left, right) {
  console.log('MERGING: ', key);
  return R.merge(left, right);
}

const toJS = R.reduce((acc, [k, v]) => {
  return R.mergeWithKey(concatMediaQueries, acc, nativeCSS.convert(v));
}, {})

// hmm, I need to be able to replace the var(--foo)
// variables. maybe I should have done this earlier.
const processVariables = styles => {
  const { root } = styles;
  const rootKeys = R.keys(root);
  return R.compose(
    R.reduce((acc, [k, v]) => {
      // console.log(R.values(v));
      // console.log(root)
      // console.log(k, v);
      return acc;
    }, {}),
    R.toPairs
  )(R.omit('root', styles))
}

tachyonsModules()
  .then(R.pluck('name'))
  .then(R.reject(R.contains(R.__, moduleBlacklist)))
  .then(R.reduce(constructFile, {}))
  .then(R.toPairs)
  .then(toJS)
  // .then(processVariables)
  // .then(x => console.log(x))
  .then(toJSON)
  .then(addExports)
  .then(writeFile)
  .catch(e => console.log(e))

function toJSON(js) { return JSON.stringify(js, null, 2); }

function addExports(json) { return `module.exports = ${json}` }

function writeFile(file) {
  return new Promise((res, rej) => {
    fs.writeFile('index.js', file, (err, result) => {
      if (err) { rej(err) }
      res(result);
    })
  })
}

function constructFile (modules, module) {
  var moduleLocation = getModuleCssLocation(module)
  var moduleName = getModuleKey(module)
  // const key = '_' + moduleName + '.css';
  return R.assoc(moduleName, moduleLocation, modules);
}

function isTachyonsModule (module) {
  return module.indexOf('tachyons') !== -1
}

function isNormalizeModule (module) {
  return module === 'normalize.css'
}

function getModuleCssLocation (module) {
  try {
    if (isTachyonsModule(module)) {
      return 'node_modules/' + module + '/' + require('./node_modules/' + module + '/package.json').style
    } else if (isNormalizeModule(module)) {
      return 'node_modules/' + module + '/' + module
    } else {
      console.error('Unknown module: ' + module)
    }
  } catch (e) {
    console.log(e)
  }
}

function getModuleKey (module) {
  return module.replace(/(tachyons-|\.css)/ig, '')
}

