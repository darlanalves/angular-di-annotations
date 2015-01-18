var esprima = require('esprima'),
	walker = require('esprima-walk').walk,
	Token = esprima.Syntax,
	Parser = require('./Parser');

var Syntax = {
	Function: 'Function',
	Variable: 'Variable'
};

function TreeWalker(tree) {
	if (!tree) {
		throw new Error('Missing source tree');
	}

	if (typeof tree !== 'object' || tree.type !== Token.Program) {
		throw new Error('Invalid source tree');
	}

	this.tree = tree;
	this.walkNode = walkNode.bind(this);
}

TreeWalker.prototype = {
	constructor: TreeWalker,
	walk: walk
};

TreeWalker.Syntax = Syntax;

function walk() {
	this.nodes = [];

	walker(this.tree, this.walkNode);

	return this.nodes;
}

function walkNode(node) {
	var self = this;

	if (typeof node === 'number') return;

	switch (node.type) {
		case Token.FunctionDeclaration:
			handleFunction(node, self);
			break;

		case Token.VariableDeclaration:
			handleVariable(node, self);
			break;

		default:
			handleUnknownNode(node, self);
	}
}

/**
 * Process a function declaration
 */
function handleFunction(functionNode, walker) {
	var result = {
		type: Syntax.Function,
		name: functionNode.id.name,
		params: getFunctionParamNames(functionNode.params),
		annotations: {
			before: [],
			after: []
		}
	};

	var leadingComments = functionNode.id.leadingComments || [];

	if (functionNode.leadingComments) {
		leadingComments = leadingComments.concat(functionNode.leadingComments);
	}

	processComments(leadingComments, functionNode.trailingComments, result.annotations);

	walker.nodes.push(result);
}

function handleVariable(variableNode, walker) {
	// we can't detect constants and values from multiple variable declarations for now
	if (variableNode.declarations.length > 1) return;

	var variableDeclaration = variableNode.declarations[0];

	var result = {
		type: Syntax.Variable,
		name: variableDeclaration.id.name,
		annotations: {
			before: [],
			after: []
		}
	};

	var leadingComments = variableDeclaration.leadingComments || [];

	if (variableNode.leadingComments) {
		leadingComments = leadingComments.concat(variableNode.leadingComments);
	}

	processComments(leadingComments, variableNode.trailingComments, result.annotations);

	walker.nodes.push(result);
}

function getFunctionParamNames(params) {
	return params.map(function(param) {
		return param.name;
	});
}

function processComments(leading, trailing, annotations) {
	if (leading && leading.length) {
		leading.forEach(function(comment) {
			parseComment(comment, annotations.before);
		});
	}

	/*if (trailing && trailing.length) {
		trailing.forEach(function(comment) {
			parseComment(comment, annotations.after);
		});
	}*/
}

function parseComment(comment, resultingArray) {
	var result;

	if (comment.type === 'Block') {
		result = Parser.parseBlockComment(comment.value);
	} else {
		result = Parser.parseLineComment(comment.value);
	}

	resultingArray.push.apply(resultingArray, result);
}

function handleUnknownNode(node, walker) {
	// console.log(node.type, node.name);
}

module.exports = TreeWalker;
