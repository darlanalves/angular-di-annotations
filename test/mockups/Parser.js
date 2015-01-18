var tagSimple = {
	name: 'tag',
	value: 'foo'
};

var tagSimpleNoValue = {
	name: 'empty'
};

var tagAttributes = {
	name: 'person',
	value: {
		name: 'John',
		age: 2
	}
};

var singleLine = {
	text: '// @tag foo',
	tags: [tagSimple]
};

var singleLineNoValue = {
	text: '// @empty  ',
	tags: [tagSimpleNoValue]
};

var singleLineWithAttributes = {
	text: '// @person (name: "John",age: 2)',
	tags: [tagAttributes]
};

var multiline = {
	text: '/**\n * @tag foo\n\t * @empty  \n *\t\t @person (name: "John",age: 2)\n */\n',
	tags: [tagSimple, tagSimpleNoValue, tagAttributes]
};

module.exports = {
	singleLine: singleLine,
	singleLineNoValue: singleLineNoValue,
	singleLineWithAttributes: singleLineWithAttributes,
	multiline: multiline
};
