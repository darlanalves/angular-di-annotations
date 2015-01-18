var assert = require('assert'),
	TreeWalker = require('../lib/').TreeWalker,
	esprima = require('esprima'),
	fs = require('fs'),
	sampleTree = esprima.parse(fs.readFileSync(__dirname + '/mockups/sampleFile.js', 'utf8'), {
		attachComment: true
	});

describe('TreeWalker', function() {
	describe('#walkTree', function() {
		it('should not continue without a valid source tree', function() {
			function checkInvalidTree() {
				return TreeWalker.walkTree({});
			}

			assert.throws(checkInvalidTree, Error, 'A valid source tree must be checked');
		});

		it('should process the source tree and return the tokens', function() {
			var tokens = TreeWalker.walkTree(sampleTree);
			assert.notEqual(tokens.length, 0, 'No tokens returned from walker');
			// console.log('>>', JSON.stringify(tokens, null, '\t'));
		});

		xit('should be very fast for thousands of items ( < 2ms)', function() {
			var start = new Date();

			for (var i = 0; i < 1000; i++) {
				TreeWalker.walkTree(sampleTree);
			}

			var end = new Date();
			var time = end - start;

			assert.equal(time < 2000, true, 'Is taking more than 2ms: ' + time);
		});
	});
});
