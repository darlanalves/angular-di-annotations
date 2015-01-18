var LINE_WITH_TAG_AND_VALUE = /^[@]{1}(\S+)\s+(.+)$/,
	LINE_WITH_TAG_ONLY = /^[@]{1}(.+?)\s*?$/,
	VALUE_ATTRIBUTES = /^\s*?\(([^\)]+)\)\s*?$/,
	COMMENT_TRAILING_CHARS = /^([^@]+)/g;

function parseLineComment(comment) {
	var result = [],
		line, parsedTag;

	if (!comment) {
		return result;
	}

	line = String(comment.replace(COMMENT_TRAILING_CHARS, '')).trim();

	if (!line) {
		return result;
	}

	parsedTag = parseLine(line);

	if (null !== parsedTag) {
		result.push(parsedTag);
	}

	return result;
}

function parseBlockComment(comment) {
	if (!comment) return [];

	var commentLines = String(comment || '').split('\n'),
		result = [];

	commentLines.forEach(function(line) {
		line = line.replace(COMMENT_TRAILING_CHARS, '').trim();

		if (!line) return;

		var parsedTag = parseLine(line);

		if (null !== parsedTag) {
			result.push(parsedTag);
		}
	});

	return result;
}

function parseLine(line) {
	if (!line) return;

	if (LINE_WITH_TAG_AND_VALUE.test(line)) {
		return parseTagAndValue(line);
	} else if (LINE_WITH_TAG_ONLY.test(line)) {
		return parseTagOnly(line);
	} else {
		return null;
	}
}

function parseTagOnly(text) {
	var parts = text.match(LINE_WITH_TAG_ONLY);

	if (!parts) {
		return null;
	}

	return {
		name: parts[1]
	};
}

function parseTagAndValue(text) {
	var parts = text.match(LINE_WITH_TAG_AND_VALUE),
		value, attributes;

	if (!parts) {
		return null;
	}

	value = parts[2];

	attributes = value.match(VALUE_ATTRIBUTES);

	if (attributes) {
		/* jshint evil: true */
		value = new Function('return {' + attributes[1] + '}');
		value = value();
	}

	return {
		name: parts[1],
		value: value
	};
}

module.exports = {
	parseBlockComment: parseBlockComment,
	parseLineComment: parseLineComment
};
