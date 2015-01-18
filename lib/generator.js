var codegen = require('escodegen');

module.exports = function generateCode(tokens) {
	return tokens.map(codegen.generate).join('');
};
