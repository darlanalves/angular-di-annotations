var SyntaxNode = require('./SyntaxNode'),
	NodeType = SyntaxNode.NodeType,
	esprima = require('esprima'),
	constants = require('./constants'),
	logger = require('./logger');

var Generator = {
	generateAstForNode: generateAstForNode,
	generateCodeForNode: generateCodeForNode
};

function generateCodeForNode(syntaxNode) {
	var annotationsBefore = syntaxNode.annotations.before,

		// grab the last annotation before the syntax node
		tags = (annotationsBefore.length ? annotationsBefore[annotationsBefore.length - 1].tags : []),

		tagsLength = tags.length,
		tag, i, code = '';

	if (!tagsLength) return '';

	for (i = 0; i < tagsLength; i++) {
		tag = tags[i];

		switch (tag.name) {
			case 'controller':
			case 'filter':
			case 'directive':
			case 'service':
			case 'factory':
			case 'provider':
			case 'animation':
				code = generateInjectableDeclaration(tag, syntaxNode, tags);
				break;

			case 'constant':
			case 'value':
				code = generateStaticDeclaration(tag, syntaxNode, tags);
				break;

			case 'config':
			case 'run':
				code = generateExecutableBlockDeclaration(tag, syntaxNode, tags);
				break;
		}
	}

	return code;
}

function generateAstForNode(node, esprimaOptions) {
	var code = generateCodeForNode(node);

	if (code) {
		esprimaOptions = esprimaOptions || {};
		code = createAstFromCode(code, esprimaOptions);
	} else {
		code = [];
	}

	return code;
}

function createAstFromCode(code, options) {
	var ast, node = null;

	try {
		ast = esprima.parse(code, options);
		node = ast.body;
	} catch (e) {}

	return node;
}

function generateInjectableDeclaration(tag, syntaxNode, allTags) {
	return generateStaticDeclaration(tag, syntaxNode, allTags) + generateNodeAnnotation(syntaxNode);
}

function generateStaticDeclaration(tag, syntaxNode, allTags) {
	var code = constants.INJECTABLE,
		modl = makeModuleCode(allTags);

	if (!modl) {
		logger.error('Module declaration not found for', tag.name, syntaxNode.name);
	}

	return code
		.replace('%module%', modl)
		.replace('%type%', tag.name)
		.replace('%name%', tag.value || syntaxNode.name)
		.replace('%value%', syntaxNode.name);
}

function generateExecutableBlockDeclaration(tag, syntaxNode, allTags) {
	var code = constants.RUNNABLE,
		modl = makeModuleCode(allTags);

	if (!modl) {
		logger.error('Module declaration not found for', tag.name, 'block', syntaxNode.name);
	}

	return code
		.replace('%module%', modl)
		.replace('%type%', tag.name)
		.replace('%value%', tag.value || syntaxNode.name);
}

function generateNodeAnnotation(syntaxNode) {
	var code = '';

	if (syntaxNode.type === NodeType.FUNCTION && syntaxNode.params.length) {
		code = '\n' + syntaxNode.name + '.$inject = [\'%1\'];'
			.replace('%1', syntaxNode.params.join('\', \''));
	}

	return code;
}

function makeModuleCode(allTags) {
	var i = 0,
		len = allTags.length,
		code = constants.MODULE,
		tag;

	for (; i < len; i++) {
		tag = allTags[i];

		if (tag.name === 'module') {
			code = code.replace('%name%', tag.value);
			break;
		}
	}

	return code;
}

module.exports = Generator;
