var lib = require('../lib/'),
	assert = require('assert'),
	Generator = lib.Generator,

	TestHelper = require('./mockups/Generator.js'),
	esprima = require('esprima'),
	escodegen = require('escodegen'),

	esgeneratorOptions = {
		format: {
			compact: true
		}
	};

describe('Generator', function() {
	describe('#generateCodeForNode(node)', function() {
		it('should generate the code for any declaration that accepts a injectable function node (controller, service...)', function() {
			var context = {
				functionName: 'functionName',
				functionParams: ['$q', '$http'],
				dependencyName: 'dependencyName'
			};

			// injectable function types
			var injectables = ['controller', 'directive', 'filter', 'service', 'provider', 'factory', 'animation'];

			injectables.forEach(testInjectableType, context);

			function testInjectableType(dependencyType) {
				var annotationTags = [{
					name: dependencyType,
					value: this.dependencyName
				}, {
					name: 'module',
					value: 'foo'
				}];

				// AngularStub creates this variable to check the injections
				lib.constants.MODULE = '$module';

				var node = TestHelper.createFunctionNode(this.functionName, this.functionParams, annotationTags);
				var code = Generator.generateCodeForNode(node);
				var expectedParams = '[\'%1\']'.replace('%1', this.functionParams.join('\',\''));
				var expectedCode = "%module.%type('%name', %value);\n%value.$inject=%injection;"
					.replace('%module', '$module')
					.replace('%type', dependencyType)
					.replace('%name', this.dependencyName)
					.replace(/%value/g, this.functionName)
					.replace('%injection', expectedParams);

				var codeTokens = esprima.tokenize(code),
					expectedTokens = esprima.tokenize(expectedCode);

				compareTokens(codeTokens, expectedTokens);
			}
		});

		xit('should generate the code for any static value declaration (constant or value)', function() {});

		xit('should generate the code for any runnable block (run or config block)', function() {});
	});
});


function compareTokens(tokens, expected) {
	expected.forEach(function(expectedToken, index) {
		if (expectedToken.type !== this[index].type || expectedToken.value !== this[index].value) {
			throw new Error('Injectable declaration invalid. Token of type `' + expectedToken.type + '` was expected: - ' + expectedToken.value + ' -');
		}
	}, tokens);
}
