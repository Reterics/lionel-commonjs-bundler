# **Lionel CommonJS Bundler**

Lionel CommonJS Bundler is a CommonJS module bundler which converts small pieces of files/codes to one big, browser compatible javascript code. It can be a web application, library or anything else.
It is compatible with the new Standards, but compiles the simplest way possible yet. That means there is no much configuration options, but on the other hand, it is easy to  use and lightweight.

Usage (with javascript code):

```javascript

const {commonJSBundler} = require("lionel-commonjs-bundler/index");

const bundle = commonJSBundler.makeCode(contentOfFile,__dirname);
```

Usage (with javascript file):

```javascript

const {commonJSBundler} = require("lionel-commonjs-bundler/index");

const bundle = commonJSBundler.makeFile('./yourFileName.js',__dirname);
```


Install
```
npm install lionel-commonjs-bundler
```



___

This bundler is used by Lionel App by Default.
[NPM](https://www.npmjs.com/package/lionel-app) 
[GitHub](https://github.com/RedAty/lionel-app)