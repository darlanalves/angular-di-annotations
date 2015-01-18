function SyntaxNode(properties) {
	var self = this;

	Object.keys(properties || {}).forEach(function(property) {
		self[property] = properties[property];
	});

	self.annotations = {
		before: [],
		after: []
	};
}

var NodeType = {
	FUNCTION: 'Function',
	VARIABLE: 'Variable'
};


SyntaxNode.NodeType = NodeType;

module.exports = SyntaxNode;
