var lib = require('../../lib/'),
	Annotation = lib.Annotation,
	SyntaxNode = lib.SyntaxNode;

function createFunctionNode(functionName, functionParams, annotationTags) {
	var annotation = new Annotation({
		type: Annotation.BLOCK,
		tags: annotationTags
	});

	var node = new SyntaxNode({
		type: SyntaxNode.NodeType.FUNCTION,
		params: functionParams,
		name: functionName,
		hasAnnotations: true
	});

	node.annotations.before.push(annotation);

	return node;
}

module.exports = {
	createFunctionNode: createFunctionNode
};
