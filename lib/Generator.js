var SyntaxNode = require('./SyntaxNode'),
	NodeType = SyntaxNode.NodeType,
	esprima = require('esprima');

var Generator = {
	generateAstForNode: generateAstForNode,
	generateCodeForNode: generateCodeForNode
};

function generateCodeForNode(syntaxNode) {
	var annotationsBefore = syntaxNode.annotations.before,

		// grab the last annotation before the syntax node
		tags = (annotationsBefore.length ? annotationsBefore[annotationsBefore.length - 1].tags : []),

		tagsLength = tags.length,
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
			case 'animation':
				code = generateInjectableDeclaration(tag.name, syntaxNode, tag);
				break;

			case 'constant':
			case 'value':
				code = generateStaticDeclaration(tag.name, syntaxNode, tag);
				break;

			case 'config':
			case 'run':
				code = generateExecutableBlockDeclaration(tag.name, syntaxNode, tag);
				break;
		}

		return code;
	}

	return null;
}

function generateAstForNode(node, esprimaOptions) {
	var code = generateCodeForNode(node);

	if (code) {
		esprimaOptions = esprimaOptions || {};
		code = createAstFromCode(code, esprimaOptions);
	}

	return code;
}

function createAstFromCode(code, options) {
	var ast = esprima.parse(code, options),
		node = ast.body;

	return node;
}

function generateInjectableDeclaration(type, syntaxNode, annotationTag) {
	return generateStaticDeclaration(type, syntaxNode, annotationTag) + generateNodeAnnotation(syntaxNode);
}

function generateStaticDeclaration(type, syntaxNode, annotationTag) {
	var code = '$module.' + type + '(\'%1\', %2);';

	return code
		.replace('%1', annotationTag.value || syntaxNode.name)
		.replace('%2', syntaxNode.name);
}

function generateExecutableBlockDeclaration(type, syntaxNode, annotationTag) {
	var code = '$module.' + type + '(%1);';

	return code.replace('%1', annotationTag.value || syntaxNode.name);
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
