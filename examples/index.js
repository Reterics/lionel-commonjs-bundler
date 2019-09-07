const {commonJSBundler} = require("../index");

/**
 * Make bundle from file
 */
const bundleFromFile = commonJSBundler.makeFile('./loadFromFolders/index.js',__dirname+'/loadFromFolders');

/**
 * Make bundle from code
 */
const fs = require('fs');
const contentOfFile = fs.readFileSync('./loadFromFolders/index.js').toString();
const bundleFromCode = commonJSBundler.makeCode(contentOfFile,__dirname+'/loadFromFolders');

console.log(bundleFromCode,bundleFromFile);