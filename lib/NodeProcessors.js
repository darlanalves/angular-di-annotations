var Annotation = require('./Annotation'),
	SyntaxNode = require('./SyntaxNode'),
	Parser = require('./Parser');

/**
 * NOTE:
 *  - hasAnnotations
 *  - put on Runner a task to inject the new nodes
 */

var NodeProcessors = {
	handleFunction: handleFunction,
	handleVariable: handleVariable
};

function handleFunction(functionNode) {
	var node = new SyntaxNode({
		type: SyntaxNode.NodeType.FUNCTION,
		name: functionNode.id.name,
		params: getParamNamesOfFunctionNode(functionNode)
	});

	var leadingComments = functionNode.id.leadingComments || [];

	if (functionNode.leadingComments) {
		leadingComments = leadingComments.concat(functionNode.leadingComments);
	}

	processNodeComments(node, leadingComments, functionNode.trailingComments);

	return node;
}

function handleVariable(variableNode) {
	// we can't detect constants and values from multiple variable declarations for now
	if (variableNode.declarations.length > 1) return;

	var variableDeclaration = variableNode.declarations[0];

	var node = new SyntaxNode({
		type: SyntaxNode.NodeType.VARIABLE,
		name: variableDeclaration.id.name
	});

	var leadingComments = variableDeclaration.leadingComments || [];

	if (variableNode.leadingComments) {
		leadingComments = leadingComments.concat(variableNode.leadingComments);
	}

	processNodeComments(node, leadingComments, variableNode.trailingComments);

	return node;
}

function processNodeComments(node, leading, trailing) {
	var annotations = node.annotations;

	if (leading && leading.length) {
		leading.forEach(function(comment) {
			parseComment(comment, annotations.before);
		});

	}

	if (node.annotations.before.length || node.annotations.after.length) {
		node.hasAnnotations = true;
	}

	/*if (trailing && trailing.length) {
		trailing.forEach(function(comment) {
			parseComment(comment, annotations.after);
		});
	}*/
}

function parseComment(comment, resultingArray) {
	var result, annotation;

	if (comment.type === 'Block') {
		result = Parser.parseBlockComment(comment.value);
		annotation = new Annotation.BlockAnnotation(result);
	} else {
		result = Parser.parseLineComment(comment.value);
		annotation = new Annotation.LineAnnotation(result);
	}

	resultingArray.push(annotation);
}

function getParamNamesOfFunctionNode(node) {
	return node.params.map(function(param) {
		return param.name;
	});
}

module.exports = NodeProcessors;
