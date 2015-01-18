var LINE_COMMENT_WITH_SLASHES = /^\s*?\/\/(.+)$/,
	LINE_WITH_TAG_AND_VALUE = /^[@]{1}(\S+)\s+(.+)$/,
	VALUE_ATTRIBUTES = /^\s*?\(([^\)]+)\)\s*?$/,
	BLOCK_COMMENT_TRAILINGS = /^ \* |\/\*\*| ?\*\//g;

function parseLineComment(comment) {
	var result = [],
		content, parsedTag;

	if (!LINE_COMMENT_WITH_SLASHES.test(comment)) {
		return result;
	}

	content = String(comment.replace(LINE_COMMENT_WITH_SLASHES, '$1')).trim();
	parsedTag = parseTagAndValue(content);

	if (null !== parsedTag) {
		result.push(parsedTag);
	}

	return result;
}


function parseBlockComment(comment) {
	var commentLines = String(comment).split('\n'),
		result = [];

	commentLines.forEach(function(line) {
		line = line.replace(BLOCK_COMMENT_TRAILINGS, '').trim();

		if (line && !LINE_WITH_TAG_AND_VALUE.test(line)) return;

		var parsedTag = parseTagAndValue(line);

		if (null !== parsedTag) {
			result.push(parsedTag);
		}
	});

	return result;
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
