var assert = require('assert'),
	esprima = require('esprima'),
	fs = require('fs'),
	TreeWalker = require('../lib/').TreeWalker,
	sampleTree = esprima.parse(fs.readFileSync(__dirname + '/mockups/sampleFile.js', 'utf8'), {
		attachComment: true
	});

describe('TreeWalker', function() {
	describe('#constructor', function() {
		it('should not continue without a valid source tree', function() {
			function checkConstructor() {
				return new TreeWalker();
			}

			function checkInvalidTree() {
				return new TreeWalker({});
			}

			assert.throws(checkConstructor, Error, 'A source tree must be mandatory');
			assert.throws(checkInvalidTree, Error, 'A valid source tree must be checked');
		});
	});

	describe('#walk', function() {
		it('should process the source tree and return the tokens', function() {
			var walker = new TreeWalker(sampleTree);
			var tokens = walker.walk();
			console.log('>>', JSON.stringify(tokens, null, ' '));
		});
	});
});
