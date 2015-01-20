var assert = require('assert'),
	lib = require('../lib/'),
	NodeProcessors = lib.NodeProcessors,
	SyntaxNode = lib.SyntaxNode,
	Annotation = lib.Annotation,

	samples = require(__dirname + '/mockups/NodeProcessors.js');

describe('NodeProcessors', function() {
	describe('#handleFunction', function() {
		it('should process a function declaration and return the parsed SyntaxNode', function() {
			var result = NodeProcessors.handleFunction(samples.functionNode),
				annotations = result.annotations;

			assertValidSyntaxNode(result);

			assert.equal(Array.isArray(result.params), true, 'Missing parsed function parameters');

			assert(result.name === 'fooFilter');
			assert(result.type === SyntaxNode.NodeType.FUNCTION);

			// each parameter in the funcion must be mapped by name to a "params" array
			assert.deepEqual(result.params, ['Foo', 'Bar'], 'Invalid params: ' + result.params);

			// each comment found is mapped to an instance of Annotation class
			var moduleBlock = annotations.before[0];

			assert(moduleBlock instanceof Annotation);
			assert(moduleBlock.type === Annotation.BLOCK);
			assert(moduleBlock.tags.length, 2);
			assert(moduleBlock.tags[0].name === 'module');
			assert(moduleBlock.tags[0].value === 'foo-module');
			assert(moduleBlock.tags[1].name === 'requires');
			assert(moduleBlock.tags[1].value === 'bar, baz, some-other-stuff');

			var functionCommentBlock = annotations.before[1];

			assert(functionCommentBlock instanceof Annotation);
			assert(functionCommentBlock.type === Annotation.BLOCK);
			assert(functionCommentBlock.tags.length === 1);
			assert(functionCommentBlock.tags[0].name === 'filter');
			assert(functionCommentBlock.tags[0].value === 'fooFilter');

			assert.equal(functionCommentBlock instanceof Annotation, true);
		});
	});

	describe('#handleVariable', function() {
		it('should parse a variable declaration and return a SyntaxNode', function() {
			var result = NodeProcessors.handleVariable(samples.variableNode),
				annotations = result.annotations,
				constBlock = annotations.before[0];

			assertValidSyntaxNode(result);
			assert(result.name === 'someValue');

			assert(constBlock.type === Annotation.LINE);
			assert(constBlock.tags.length === 1);
			assert(constBlock.tags[0].name === 'value');
			assert(constBlock.tags[0].value === 'SOME_VALUE');
		});
	});
});

function assertValidSyntaxNode(value) {
	var annotations = value.annotations;

	assert(value instanceof SyntaxNode, 'Is not returning a SyntaxNode');
	assert(typeof annotations === 'object', 'Missing parsed function parameters');
	assert(Array.isArray(annotations.before), 'Invalid annotation object');
	assert(Array.isArray(annotations.after), 'Invalid annotation object');
	assert(value.hasAnnotations === true);
}
