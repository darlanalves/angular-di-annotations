var assert = require('assert'),
	lib = require('../lib/'),
	Parser = lib.Parser,
	mockups = require('./mockups/Parser');

describe('Parser', function() {
	describe('#parseLineComment()', function() {
		it('should return an empty array if no comment was provided', function() {
			var result = Parser.parseLineComment();
			assert.equal(Array.isArray(result), true);
			assert.equal(result.length, 0);
		});

		it('should return an empty array a invalid comment was provided', function() {
			var result = Parser.parseLineComment('123');
			assert.equal(Array.isArray(result), true);
			assert.equal(result.length, 0);
		});

		it('should parse a tag/value pair in single line comments', function() {
			var results = Parser.parseLineComment(mockups.singleLine.text);
			assertResults(results, mockups.singleLine.tags);
		});

		it('should parse a tag and its attributes in a single line comment', function() {
			var results = Parser.parseLineComment(mockups.singleLineWithAttributes.text);
			assertResults(results, mockups.singleLineWithAttributes.tags);
		});
	});

	describe('#parseBlockComment()', function() {
		it('should return an empty array if no comment was provided', function() {
			var result = Parser.parseBlockComment();
			assert.equal(Array.isArray(result), true);
			assert.equal(result.length, 0);
		});

		it('should return an empty array a invalid comment was provided', function() {
			var result = Parser.parseBlockComment('123');
			assert.equal(Array.isArray(result), true);
			assert.equal(result.length, 0);
		});

		it('should parse a multiline comments with mixed annotations', function() {
			var results = Parser.parseBlockComment(mockups.multiline.text);
			assertResults(results, mockups.multiline.tags);
		});
	});
});

function assertResults(results, tags) {
	assert.equal(results.length, tags.length, 'Number of tags parsed is not correct');

	results.forEach(function(tagToCheck, index) {
		var referenceTag = tags[index],
			expectedName = referenceTag.name,
			expectedValue = referenceTag.value;

		assert.equal(expectedName, tagToCheck.name, 'Tag name is different than expected');

		if (typeof expectedValue === 'object') {
			assert.deepEqual(tagToCheck.value, expectedValue, 'Tag value is not as expected');
		} else {
			assert.equal(tagToCheck.value, expectedValue, 'Tag value is not as expected');
		}
	});
}
