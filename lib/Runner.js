var TreeWalker = require('./TreeWalker'),
	fs = require('fs'),
	extend = require('xtend'),
	esprima = require('esprima'),
	escodegen = require('escodegen');

var Runner = {
	runOnFile: runOnFile,
	runOnString: runOnString
};

function runOnFile(file) {
	if (!fs.existsSync(file)) {
		throw new Error('File not found: ' + file);
	}

	var code = fs.readFileSync(file) || null;

	if (code) {
		code = runOnString(String(code));
	}

	return code;
}

function runOnString(string, options) {
	options = options || {};

	var parseOptions = extend({}, options.parse || {}, {
		attachComment: true
	});

	var generateOptions = extend({}, options.generateOptions || {});

	var tree = esprima.parse(string, parseOptions);

	tree = TreeWalker.walkTreeAndUpdate(tree, {
		esprima: parseOptions
	});

	return escodegen.generate(tree, generateOptions);
}

module.exports = Runner;
