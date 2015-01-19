var lib = require('../../lib/'),
	Annotation = lib.Annotation,
	SyntaxNode = lib.SyntaxNode;

var controllerAnnotation = new Annotation({
	type: Annotation.BLOCK,
	tags: [{
		name: 'controller',
		value: 'FooEditController'
	}]
});

var controllerNode = new SyntaxNode({
	type: SyntaxNode.NodeType.FUNCTION,
	params: ['$scope', '$http', 'DomainService'],
	name: 'FooEditController',
	hasAnnotations: true
});

controllerNode.annotations.before.push(controllerAnnotation);

module.exports = {
	controllerAnnotation: controllerAnnotation,
	controllerNode: controllerNode
};
