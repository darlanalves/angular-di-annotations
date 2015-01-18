var tagSimple = {
	name: 'tag',
	value: 'foo'
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

var singleLineWithAttributes = {
	text: '// @person (name: "John",age: 2)',
	tags: [tagAttributes]
};

var multiline = {
	text: '/**\n * @tag foo\n * @person (name: "John",age: 2)\n */\n',
	tags: [tagSimple, tagAttributes]
};

module.exports = {
	singleLine: singleLine,
	singleLineWithAttributes: singleLineWithAttributes,
	multiline: multiline
};
