var lib = require('../lib/'),
	assert = require('assert'),
	SyntaxNode = lib.SyntaxNode;

describe('SyntaxNode', function() {
	describe('#constructor', function() {
		it('should copy every property passed in, except `annotations`', function() {
			var source = {
				foo: 'foo',
				annotations: {}
			};

			var node = new SyntaxNode(source);

			assert(node.foo === source.foo, 'Property not copied as expected');
			assert(node.annotations !== source.annotations, 'Property `annotations` is incorrect');
		});

		it('should create a property called `annotations` with two arrays: `before` and `after`', function() {
			var node = new SyntaxNode();

			assert(Array.isArray(node.annotations.before), 'Array `before` is not valid');
			assert(Array.isArray(node.annotations.after), 'Array `after` is not valid');
		});
	});
});

describe('SyntaxNode.NodeType', function() {
	it('should have a static property called `NodeType`', function() {
		assert('NodeType' in SyntaxNode);
	});

	it('should have a set of constants to identify syntax node types', function() {
		var NodeType = SyntaxNode.NodeType;

		assert(NodeType.FUNCTION === 'Function', 'Function type is missing');
		assert(NodeType.VARIABLE === 'Variable', 'Variable type is missing');
	});
});
