var lib = require('../lib/'),
	assert = require('assert'),
	Generator = lib.Generator,
	/*Annotation = lib.Annotation,
	SyntaxNode = lib.SyntaxNode,
	NodeProcessors = lib.NodeProcessors,*/

	TestHelper = require('./mockups/Generator.js'),
	esprima = require('esprima'),
	escodegen = require('escodegen'),

	esgeneratorOptions = {
		format: {
			compact: true
		}
	};

describe('Generator', function() {
	xdescribe('#generateAstForNode(node, esprimaOptions)', function() {
		/*xit('should generate the AST for a controller function node', function() {
			var node = samples.controllerNode;
			var ast = Generator.generateAstForNode(node);
			// console.log(escodegen.generate(ast, esgeneratorOptions));
			// assert(escodegen.generate(ast, generatorOptions) === "$module.controller('FooEditController', FooEditController);");
		});*/
	});

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
				}];

				var node = TestHelper.createFunctionNode(this.functionName, this.functionParams, annotationTags),
					code = Generator.generateCodeForNode(node);

				var params = '[\'%1\']'.replace('%1', this.functionParams.join('\',\''));

				var expectedCode = "$module.%1('%2', %3);\n%3.$inject=%4;"
					.replace('%1', dependencyType)
					.replace('%2', this.dependencyName)
					.replace(/%3/g, this.functionName)
					.replace('%4', params);

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
	if (tokens.length !== expected.length) {
		// throw 'Injectable declaration not as expected: token count not equal';
	}

	expected.forEach(function(expectedToken, index) {
		if (expectedToken.type !== this[index].type || expectedToken.value !== this[index].value) {
			throw new Error('Injectable declaration invalid. Token of type `' + expectedToken.type + '` was expected: - ' + expectedToken.value + ' -');
		}
	}, tokens);
}
