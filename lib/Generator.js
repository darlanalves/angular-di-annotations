var SyntaxNode = require('./SyntaxNode'),
	NodeType = SyntaxNode.NodeType,
	esprima = require('esprima'),
	extend = require('xtend');

var Generator = {
	generateAstForNode: generateAstForNode
};

function generateAstForNode(syntaxNode, esprimaOptions) {
	var annotationsBefore = syntaxNode.annotations.before,
		tags = (annotationsBefore.length ? annotationsBefore[annotationsBefore.length - 1].tags : []),
		tagsLength = tags.length,
		esprimaOptions = esprimaOptions || {},
		tag, i, code;

	if (!tagsLength) return null;

	for (i = 0; i < tagsLength; i++) {
		tag = tags[i];
		code = null;

		switch (tag.name) {
			case 'controller':
			case 'filter':
			case 'directive':
			case 'service':
			case 'factory':
			case 'provider':
				code = generateInjectableDeclaration(tag.name, syntaxNode, tag);
				break;

			case 'constant':
			case 'value':
				code = generateStaticDeclaration(tag.name, syntaxNode, tag);
				break;
		}

		if (code) {
			code = createAstFromCode(code, esprimaOptions);
		}

		return code;
	}

	return null;
}

function createAstFromCode(code, options) {
	var ast = esprima.parse(code, options),
		node = ast.body;

	return node;
}

function generateInjectableDeclaration(type, syntaxNode, annotationTag) {
	var code = '$module.' + type + '(\'%1\', %2);';

	code = code
		.replace('%1', annotationTag.value)
		.replace('%2', syntaxNode.name);

	return code + generateNodeAnnotation(syntaxNode);
}

function generateStaticDeclaration(type, syntaxNode, annotationTag) {
	var code = '$module.' + type + '(\'%1\', %2);';

	return code
		.replace('%1', annotationTag.value)
		.replace('%2', syntaxNode.name);
}

function generateNodeAnnotation(syntaxNode) {
	var code = '';

	if (syntaxNode.type === NodeType.FUNCTION && syntaxNode.params.length) {
		code = '\n' + syntaxNode.name + '.$inject = [\'%1\'];'
			.replace('%1', syntaxNode.params.join("', '"));
	}

	return code;
}

module.exports = Generator;
