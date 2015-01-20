var Annotation = require('../lib/').Annotation;
var assert = require('assert');

describe('Annotation', function() {
	describe('#constructor', function() {
		it('should not allow a construction without arguments', function() {
			function checkConstructor() {
				return new Annotation();
			}

			assert.throws(checkConstructor, Error, 'Annotations are being instantiated without arguments');
		});

		it('should stop if `tags` property is not present', function() {
			function checkTags() {
				return new Annotation(Annotation.LINE, null);
			}

			assert.throws(checkTags, Error, 'Tags should be required in the constructor');
		});

		it('should stop if `type` property is not present', function() {
			function checkTags() {
				return new Annotation(null, [{}]);
			}

			assert.throws(checkTags, Error, 'Type should be required in the constructor');
		});

		it('should stop if `type` property is not valid for multiple tags', function() {
			function checkInvalidType() {
				return new Annotation(Annotation.LINE, [{}, {}]);
			}

			assert.throws(checkInvalidType, Error, 'Multiple tags should not be allowed for line comment');
		});

		it('should allow the construction with a config object holding tags and type', function() {
			var source = {
				type: Annotation.LINE,
				tags: [{}]
			};

			var annotation = new Annotation(source);

			assert.equal(annotation.tags, source.tags, 'Tags are not handled properly');
			assert.equal(annotation.type, source.type, 'Type is not handled properly');
		});
	});

	describe('#toString', function() {
		it('should convert the annotation back to a line comment', function() {
			var tags = [{
				name: 'tag',
				value: 'value'
			}];

			var annotation = new Annotation.LineAnnotation(tags),
				comment = annotation.toString(),
				expected = '// @tag value';

			assert.equal(comment, expected, 'Line comment is not generated as expected');
		});

		it('should convert the annotation back to a block comment', function() {
			var tags = [{
				name: 'tag',
				value: 'value'
			}, {
				name: 'person',
				value: {
					name: 'Jack',
					age: 32
				}
			}];

			var annotation = new Annotation.BlockAnnotation(tags),
				comment = annotation.toString(),
				expected = '/**\n * @tag value\n * @person ("name":"Jack","age":32)\n */';

			assert.equal(comment, expected, 'Block comment is not generated as expected');
		});
	});

	describe('#toJSON', function() {
		it('should convert the annotation back to an object literal suitable for Annotation constructor', function() {
			var annotation = new Annotation(Annotation.LINE, [{
				name: 'tag',
				value: 'value'
			}]);

			var object = annotation.toJSON(),
				expected = {
					type: Annotation.LINE,
					tags: [{
						name: 'tag',
						value: 'value'
					}]
				};

			assert.deepEqual(object, expected, 'Object representation of annotation is not as expected');
		});

		it('should generate an object that can be used to reconstruct the annotation', function() {
			var source = {
				type: Annotation.LINE,
				tags: [{
					name: 'tag',
					value: 'value'
				}]
			};

			var firstAnnotation = new Annotation(source),
				firstAnnotationSource = firstAnnotation.toJSON(),
				secondAnnotation = new Annotation(firstAnnotationSource),
				secondAnnotationSource = secondAnnotation.toJSON();

			assert.deepEqual(secondAnnotationSource, firstAnnotationSource, 'The generated source is not as expected');
		});
	});

	describe('#toObject', function() {
		it('should convert the annotation to an object literal with tags and values as a hash map', function() {
			var tags = [{
				name: 'tag',
				value: 'value'
			}, {
				name: 'person',
				value: {
					name: 'Jack',
					age: 32
				}
			}];

			var annotation = new Annotation(Annotation.BLOCK, tags);

			var object = annotation.toObject(),
				expected = {
					type: Annotation.BLOCK,
					tags: {
						tag: 'value',
						person: tags[1].value
					}
				};

			assert.deepEqual(object, expected, 'toObject() result not as expected');
		});
	});

	describe('::BlockAnnotation', function() {
		it('should make a block annotation from tags only', function() {
			var annotation = new Annotation.BlockAnnotation([]);
			assert.equal(annotation.type, Annotation.BLOCK, 'Invalid BlockAnnotation constructor');
		});
	});

	describe('::LineAnnotation', function() {
		it('should make a line annotation from tags only', function() {
			var annotation = new Annotation.LineAnnotation([]);
			assert.equal(annotation.type, Annotation.LINE, 'Invalid LineAnnotation constructor');
		});
	});
});
