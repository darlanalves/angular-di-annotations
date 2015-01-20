var assert = require('assert'),
	lib = require('../lib/'),
	Runner = lib.Runner,
	fs = require('fs'),
	sampleFile = __dirname + '/samples/filter.js',
	sampleContent = fs.readFileSync(sampleFile),
	AngularStub = require(__dirname + '/stub/AngularStub');

describe('Runner', function() {
	describe('#runOnFile', function() {
		it('should read and modify the content of a JS file', function() {
			var result = Runner.runOnFile(sampleFile);
			checkResult(result);
		});
	});

	describe('#runOnString', function() {
		it('should parse and modify a script in a string', function() {
			var result = Runner.runOnString(sampleContent);
			checkResult(result);
		});
	});
});


function checkResult(code) {
	var fn = new Function('$module', code),
		stub = new AngularStub(fn);

	stub.runStub();

	assert(typeof stub.filters.double === 'function', 'Filter not found');
	assert(stub.filters.double.$inject[0] === 'MathHelper', 'Filter dependency not found');
}
