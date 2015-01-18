var esprima = require('esprima'),
	Token = esprima.Syntax;

var NodeProcessors = require('./NodeProcessors');

function walkTree(tree) {
	if (!tree) {
		throw new Error('Missing source tree');
	}

	if (typeof tree !== 'object' || tree.type !== Token.Program) {
		throw new Error('Invalid source tree');
	}

	var nodes = [];

	processSourceTreeNodes(tree, function(node) {
		var result = processNode(node);

		if (null !== result) {
			this.push(result);
		}
	}, nodes);

	return nodes;
}


function processSourceTreeNodes(ast, fn, context) {
	var stack = [ast],
		i, j, key, len, node, child;

	/**
	 * Condition to touch a node: node.type being FunctionDeclaration or VariableDeclaration
	 */

	for (i = 0; i < stack.length; i += 1) {
		node = stack[i];

		if (node.type === Token.FunctionDeclaration || node.type === Token.VariableDeclaration) {
			fn.call(context, node);
		}

		for (key in node) {
			child = node[key];

			if (child instanceof Array) {
				for (j = 0, len = child.length; j < len; j += 1) {
					stack.push(child[j]);
				}

			} else if (child != void 0 && typeof child.type === 'string') {
				stack.push(child);
			}
		}
	}
}

function processNode(node) {
	var result = null;

	switch (node.type) {
		case Token.FunctionDeclaration:
			result = NodeProcessors.handleFunction(node);
			break;

		case Token.VariableDeclaration:
			result = NodeProcessors.handleVariable(node);
			break;

		default:
			// handleUnknownNode(node, self);
	}

	return result;
}

module.exports = {
	walkTree: walkTree
};
