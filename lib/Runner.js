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

	var code = fs.readFileSync(file, 'utf8') || null;

	if (code) {
		code = runOnString(code, options);
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

	var esprimaOptions = extend({}, options.parse || {}, {
		attachComment: true
	});

	var parseOptions = {
		esprima: esprimaOptions
	};

	var generateOptions = extend({}, options.generateOptions || {}),
		tree = esprima.parse(string, esprimaOptions);

	tree = TreeWalker.walkTreeAndUpdate(tree, parseOptions);

	return escodegen.generate(tree, generateOptions);
}

module.exports = Runner;
