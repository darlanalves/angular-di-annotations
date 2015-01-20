var esprima = require('esprima'),
	Token = esprima.Syntax,
	xtend = require('xtend'),
	walk = require('walk-ast'),
	NodeProcessors = require('./NodeProcessors'),
	Generator = require('./Generator');

var defaultOptions = {
	attachNode: false
};

function getOptions(options) {
	return xtend({}, defaultOptions, options || {});
}

function walkTree(tree, options) {
	if (!tree) {
		throw new Error('Missing source tree');
	}

	if (typeof tree !== 'object' || tree.type !== Token.Program) {
		throw new Error('Invalid source tree');
	}

	options = getOptions(options);

	var context = {
		nodes: [],
		options: options
	};

	function traverse(node) {
		var result = createSyntaxNode(node);

		if (null === result) return;

		if (this.options.attachNodes) {
			result.sourceNode = node;
			result.parentNode = node.parentNode;
		}

		this.nodes.push(result);
	}

	walk(tree, traverse.bind(context));

	return context.nodes;
}

function walkTreeAndUpdate(tree, options) {
	if (!tree) {
		throw new Error('Missing source tree');
	}

	if (typeof tree !== 'object' || tree.type !== Token.Program) {
		throw new Error('Invalid source tree');
	}

	options = getOptions(options);

	// TODO write a method to clone the tree. deepCopy adds the functions to the copy right now
	/*if (options.clone) {
		tree = cloneTree(tree);
	}*/

	var context = {
		options: options,
		queue: []
	};

	walk(tree, processAstNode.bind(context));

	if (context.queue.length) {
		processModificationQueueOfContext(context);
	}

	return tree;
}

function processAstNode(node) {
	var syntaxNode = createSyntaxNode(node);

	if (null === syntaxNode) return;

	var annotations = syntaxNode.annotations;

	if (annotations.before.length) {
		this.queue.push({
			parentNode: node.parentNode,
			astNode: node,
			syntaxNode: syntaxNode
		});
	}
}

function processModificationQueueOfContext(context) {

	context.queue.forEach(processJob, context);

	function processJob(job) {
		var body = job.parentNode.body,
			index, nodeToInsert, spliceArgs;

		if (!body || !Array.isArray(body)) return;

		index = job.parentNode.body.indexOf(job.astNode);

		if (index === -1) return;

		nodeToInsert = Generator.generateAstForNode(job.syntaxNode, this.options.esprima);

		if (null === nodeToInsert) return;

		spliceArgs = [index + 1, 0].concat(nodeToInsert);

		body.splice.apply(body, spliceArgs);
	}
}

function createSyntaxNode(node) {
	var result = null;

	switch (node.type) {
		case Token.FunctionDeclaration:
			result = NodeProcessors.handleFunction(node);
			break;

		case Token.VariableDeclaration:
			result = NodeProcessors.handleVariable(node);
			break;
	}

	return result;
}

module.exports = {
	walkTree: walkTree,
	walkTreeAndUpdate: walkTreeAndUpdate
};
