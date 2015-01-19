var assert = require('assert'),
	TreeWalker = require('../lib/').TreeWalker,
	AngularStub = require(__dirname + '/stub/AngularStub'),
	esprima = require('esprima'),
	escodegen = require('escodegen'),
	fs = require('fs'),

	esprimaOptions = {
		attachComment: true
	},

	walkOptions = {
		esprima: esprimaOptions
	};

describe('TreeWalker', function() {
	describe('#walkTree(tree, options)', function() {
		it('should not continue without a valid source tree', function() {
			function checkInvalidTree() {
				return TreeWalker.walkTree({});
			}

			assert.throws(checkInvalidTree, Error, 'A valid source tree must be checked');
		});

		it('should process the source tree and return the tokens', function() {
			var sampleTree = readFileAsAst('sampleFile.js');
			var tokens = TreeWalker.walkTree(sampleTree);
			assert.notEqual(tokens.length, 0, 'No tokens returned from walker');
			// console.log('>>', JSON.stringify(tokens[0], null, '\t'));
		});

		it('should attach the original AST node if option `attachNodes` is true', function() {
			var sampleTree = readFileAsAst('sampleFile.js');
			var tokens = TreeWalker.walkTree(sampleTree, {
				attachNodes: true
			});

			assert.notEqual(tokens.length, 0, 'No tokens returned from walker');
			assert(tokens[0].sourceNode !== undefined);
			assert(tokens[0].parentNode !== undefined);
			// console.log('>>', JSON.stringify(tokens[0].sourceNode, null, '\t'));
		});
	});

	describe('#walkTreeAndUpdate(tree, options)', function() {
		it('should not continue without a valid source tree', function() {
			function checkInvalidTree() {
				return TreeWalker.walkTreeAndUpdate({});
			}

			assert.throws(checkInvalidTree, Error, 'A valid source tree must be checked');
		});

		it('should declare controllers', function() {
			var stub = runStubOnFile('sampleController.js');

			assert(typeof stub.controllers.FooController === 'function', 'Controller declaration not found');
			assert.deepEqual(stub.controllers.FooController.$inject, ['$scope'], 'Controller dependencies not declared');
		});

		it('should declare directives', function() {
			var stub = runStubOnFile('sampleDirective.js');

			assert(typeof stub.directives.sample === 'function', 'Directive declaration not found');
			assert.deepEqual(stub.directives.sample.$inject, ['$compile'], 'Directive dependencies not declared');
		});

		it('should declare filters', function() {
			var stub = runStubOnFile('sampleFilter.js');

			assert(typeof stub.filters.double === 'function', 'Filter declaration not found');
			assert.deepEqual(stub.filters.double.$inject, ['MathHelper'], 'Filter dependencies not declared');
		});

		it('should declare services', function() {
			var stub = runStubOnFile('sampleServices.js');

			assert(typeof stub.services.DomainService === 'function', 'Service declaration not found');
			assert.deepEqual(stub.services.DomainService.$inject, ['$http', '$q', 'CONST_ONE'], 'Service dependencies not declared');

			assert(typeof stub.factories.FunctionFactory === 'function', 'Factory declaration not found');
			assert.deepEqual(stub.factories.FunctionFactory.$inject, ['DomainService'], 'Factory dependencies not declared');

			assert(typeof stub.providers.SomeProvider === 'function', 'Provider declaration not found');
			assert.deepEqual(stub.providers.SomeProvider.$inject, ['$locationProvider'], 'Provider dependencies not declared');
		});
	});
});

function readFileAsAst(file) {
	var sampleCode = fs.readFileSync(__dirname + '/mockups/' + file, 'utf8');
	var tree = esprima.parse(sampleCode, esprimaOptions);

	// optimization only. the comments won't be traversed
	delete tree.comments;

	return tree;
}


function compileCode(code) {
	var fn = new Function('$module', code);
	return fn;
}

function runStubOnFile(file) {
	var sampleTree = readFileAsAst(file),
		transformedTree = TreeWalker.walkTreeAndUpdate(sampleTree, walkOptions),
		transformedCode = escodegen.generate(transformedTree),
		compiledCode = compileCode(transformedCode),
		stub = new AngularStub(compiledCode);

	stub.runStub();

	return stub;
}
