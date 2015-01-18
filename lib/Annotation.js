var assert = require('assert');

function Annotation(type, tags) {
	if (typeof type === 'object') {
		tags = type.tags;
		type = type.type;
	}

	assert.equal(!!type, true, 'Missing `type` property');
	assert.equal(Array.isArray(tags), true, 'Property `tags` is not a valid array of tags');

	if (type === Annotation.LINE && tags.length > 1) {
		throw new Error('Invalid annotation type for the current tag set');
	}

	this.tags = tags;
	this.type = type;
}

Annotation.BLOCK = 'block';
Annotation.LINE = 'line';

Annotation.BlockAnnotation = function(tags) {
	return new Annotation(Annotation.BLOCK, tags);
};

Annotation.LineAnnotation = function(tags) {
	return new Annotation(Annotation.LINE, tags);
};

Annotation.prototype = {
	constructor: Annotation,
	toString: toString,
	toJSON: toJSON
};


function toString() {
	if (this.type === Annotation.LINE) {
		return makeLineComment(this);
	}

	return makeBlockComment(this);
}

function toJSON() {
	var tags = this.tags.map(function(tag) {
		return {
			name: tag.name,
			value: tag.value
		};
	});

	return {
		type: this.type,
		tags: tags
	};
}

function makeLineComment(annotation) {
	var tag = annotation.tags[0];
	return '// @' + tag.name + ' ' + tag.value;
}

function makeBlockComment(annotation) {
	var comment = '/**';

	annotation.tags.forEach(function(tag) {
		var line = '\n * @' + tag.name + ' ',
			value;

		if (typeof tag.value === 'object') {
			value = JSON.stringify(tag.value).slice(1).slice(0, -1);
			line += '(' + value + ')';
		} else {
			line += tag.value;
		}

		comment += line;
	});

	comment += '\n */';

	return comment;
}

module.exports = Annotation;
