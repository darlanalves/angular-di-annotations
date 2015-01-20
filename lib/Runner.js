var TreeWalker = require('./TreeWalker'),
	fs = require('fs'),
	extend = require('xtend'),
	esprima = require('esprima'),
	escodegen = require('escodegen');

var Runner = {
	runOnFile: runOnFile,
	runOnString: runOnString
};

/**
 * @param {String} file 	File path to load and process
 * @param {Object} options 	Same options of #runOnString()
 */
function runOnFile(file, options) {
	if (!fs.existsSync(file)) {
		throw new Error('File not found: ' + file);
	}

	var code = fs.readFileSync(file) || null;

	if (code) {
		code = runOnString(String(code), options);
	}

	return code;
}

/**
 * @param {String} string The code to work on
 * @param {Object} options
 *        {Object} options.parse 		Esprima options
 *        {Object} options.generate 	Escodegen options
 */
function runOnString(string, options) {
	options = options || {};

	var parseOptions = {
		esprima: extend({}, options.parse || {}, {
			attachComment: true
		})
	};

	var generateOptions = extend({}, options.generateOptions || {}),
		tree = esprima.parse(string, parseOptions);

	TreeWalker.walkTreeAndUpdate(tree, parseOptions);

	return escodegen.generate(tree, generateOptions);
}

module.exports = Runner;
