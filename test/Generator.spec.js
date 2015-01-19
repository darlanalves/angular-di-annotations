var lib = require('../lib/'),
	assert = require('assert'),
	Generator = lib.Generator,
	Annotation = lib.Annotation,
	SyntaxNode = lib.SyntaxNode,

	samples = require('./mockups/Generator.js'),
	escodegen = require('escodegen');

describe('Generator', function() {
	describe('#generateAstForNode', function() {
		xit('should generate the AST for a controller function node', function() {
			var node = samples.controllerNode;
			var ast = Generator.generateAstForNode(node);
			console.log(ast);
			assert(escodegen.generate(ast) === "$module.controller('FooEditController', FooEditController);");
		});

		xit('should generate the AST for a directive function node', function() {
			var node = samples.directiveNode;
			var ast = Generator.generateAstForNode(node);

			assert(escodegen.generate(ast) === "$module.controller('FooEditController', FooEditController);");
		});
	});
});

/*
{ type: 'Function',
  params: [ '$scope', '$http', 'DomainService' ],
  name: 'FooEditController',
  hasAnnotations: true,
  annotations: { before: [ [Object] ], after: [] } }
 */
