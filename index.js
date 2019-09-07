/**
* Lionel-App: CommonJS Bundler
* Copyright (C) 2016 Attila Reterics
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @package    lionel-app
* @subpackage lionel-commonjs-bundler
* @author     Attila Reterics
* @license    http://www.gnu.org/copyleft/gpl.html GNU GPL
* @copyright  (C) 2016 Attila Reterics, reterics.attila@gmail.com
*
*/

const path = require('path');
const fs = require('fs');

const moduleBundler = {
	version : '1.0',
	regexps : {
		/**
		 * With this Regular Expressions, the code select Require functions from the code and load files according to
		 * them.
		 **/
		commonJS : {
			require:/(const)+\s*({[\w_,\n\s]*}|[\w_\n\s]*)\s*=\s*require\(['"][\w_./-]+['"]\)[.\w]*;*/g,
			path:/['"][\w_./-]+['"]/g,
		}
	},
	/**
	 * Default working directory, Important for "loadFile"
	 * You can change anytime according to your project
	 */
	cwd : __dirname,
	loadedCache : {},
	/**
	 * Load file from the filesystem according to the CommonJS require path
	 * @param {String} methodName
	 * @param {String} filepath
	 * @param {String} cwd
	 * @returns {string|*}
	 */
	loadFile : function (methodName, filepath, cwd) {
		let realPath = path.resolve(cwd, filepath);
		if (!realPath.endsWith('.js')) {
			realPath += '.js';
		}
		if (fs.existsSync(realPath)) {
			if(moduleBundler.loadedCache[realPath]){
				return '' ;//moduleBundler.packInBundle(methodName, moduleBundler.loadedCache[realPath]);
			} else{
				const content = fs.readFileSync(realPath).toString();
				moduleBundler.loadedCache[realPath] = content;
				return moduleBundler.packInBundle(methodName, content);
			}
		} else {
			return '/** Module not found: ' + methodName + ' **/';
		}
	},
	/**
	 * Generate a name of the virtual function what we use for calling requires in browser
	 * @param filepath
	 * @param cwd
	 * @returns {string}
	 */
	generateName : function (filepath, cwd){
		return path
			.resolve(cwd, filepath)
			.replace(moduleBundler.cwd, '');
		/*.replace(/\//g, '_')
		.replace(/\\/g, '_');*/
	},
	/**
	 * We load files into a bundle in the browser and store them in the window._modules folder
	 * @param methodName
	 * @param fileContent
	 * @returns {string}
	 */
	packInBundle : function (methodName, fileContent) {
		const bundleFrameStart =
			'window._modules["'+methodName+'"] = (function() {\n' +
			'const module = {\n' +
			'    exports : {}\n' +
			'};\n' +
			'let exports = null;\n' +
			'\n' +
			'(function(){\n';

		const bundleFrameEnd =
			'' +
			'})();\n' +
			'' +
			'if (exports) {\n' +
			'   module.exports = Object.assign({},module.exports,exports);\n' +
			'}\n' +
			'return module.exports;\n' +
			'})();';

		return bundleFrameStart + fileContent + bundleFrameEnd;
	},
	/**
	 * From a Javascript code (in string) converts Browser compatible Javascript with compiling CommonJS codes into
	 * the code from every file
	 * @param {String} JSCode
	 * @param {String} cwd
	 * @param options
	 */
	makeCode : function (JSCode, cwd, options) {
		if(!cwd || typeof cwd !== 'string') cwd = this.cwd;
		if(!options) options = {};
		const rule = this.regexps.commonJS;
		const bundle = this;

		if (options.loadedCache) {
			bundle.loadedCache = options.loadedCache;
		} else {
			// Empty cache before bundle
			bundle.loadedCache = {};
		}


		let globalContent = '';
		/**
		 *
		 * @param {String} code - The javascript code as a string what contains require() calls
		 * @param {String} cwd
		 */
		const loadRequire = function (code,cwd) {
			return code.replace(rule.require,function (require) {

				let methodName = '';
				/**
				 * Extract the source of file from the require call.
				 * @type {string}
				 */
				let address = '';
				require = require.replace(rule.path, d => {
					address = d.substring(1, d.length - 1);
					methodName = bundle.generateName(address,cwd);
					return '"' + methodName + '"';
				});

				/**
				 * Bundle Recursive
				 */
				const loadedFileContent = bundle.loadFile(methodName, address, cwd);
				const loadedFileFolder = address.substring(0,address.lastIndexOf('/') + 1);
				const loaded = loadRequire(loadedFileContent, path.resolve(cwd,loadedFileFolder));
				globalContent += loaded;
				return require;

			})
		};

		const loader = 'if ( typeof window.require !== "function" ) { window.require = function(path){return window._modules[path] || {}}; }' +
			'if ( !window._modules ) { window._modules = {}; }';

		const transpiredData = loadRequire(JSCode,cwd);

		options.loadedFiles = Object.keys(bundle.loadedCache);
		// Empty cache after bundle
		bundle.loadedCache = {};

		return loader + globalContent + transpiredData;
	},
	/**
	 * From a Javascript file converts Browser compatible Javascript with compiling CommonJS codes into the code from
	 * every file
	 * @param {String} path
	 * @param {String} cwd
	 * @returns {*}
	 */
	makeFile : function (path, cwd) {
		if(!cwd || typeof cwd !== 'string') cwd = this.cwd;

		if (fs.existsSync(path)) {
			return this.makeCode(fs.readFileSync(path).toString(),cwd);
		}
		throw 'File not found!';
	}
};


module.exports = {
	commonJSBundler : moduleBundler
};