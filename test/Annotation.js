var Annotation = require('../lib/').Annotation;
var assert = require('assert');

describe('Annotation', function() {
	describe('#constructor', function() {
		it('should not allow a construction without the properties', function() {
			function checkConstructor() {
				return new Annotation();
			}

			assert.throws(checkConstructor, Error, 'Annotations are being instantiated without properties');
		});

		it('should stop if `tags` property is not present', function() {
			function checkTags() {
				return new Annotation({
					tags: null
				});
			}

			assert.throws(checkTags, Error, 'Tags should be required in the constructor');
		});

		it('should stop if `tags` property is not present', function() {
			function checkInvalidType() {
				return new Annotation({
					tags: [{}, {}],
					type: Annotation.LINE
				});
			}

			assert.throws(checkInvalidType, Error, 'Multiple tags should not be allowed in a line comment');
		});
	});

	describe('#toString', function() {
		it('should convert the annotation back to a line comment', function() {
			var annotation = new Annotation({
				type: Annotation.LINE,
				tags: [{
					name: 'tag',
					value: 'value'
				}]
			});

			var comment = annotation.toString(),
				expected = '// @tag value';

			assert.equal(comment, expected, 'Line comment is not generated as expected');
		});

		it('should convert the annotation back to a block comment', function() {
			var annotation = new Annotation({
				type: Annotation.BLOCK,
				tags: [{
					name: 'tag',
					value: 'value'
				}, {
					name: 'person',
					value: {
						name: 'Jack',
						age: 32
					}
				}]
			});

			var comment = annotation.toString(),
				expected = '/**\n * @tag value\n * @person ("name":"Jack","age":32)\n */';

			assert.equal(comment, expected, 'Block comment is not generated as expected');
		});
	});

	describe('#toJSON', function() {
		it('should convert the annotation back to an object literal', function() {
			var annotation = new Annotation({
				type: Annotation.LINE,
				tags: [{
					name: 'tag',
					value: 'value'
				}]
			});

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
});
