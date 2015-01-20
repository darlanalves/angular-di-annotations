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
			var sampleTree = readFileAsAst('all.js');
			var tokens = TreeWalker.walkTree(sampleTree);
			assert.notEqual(tokens.length, 0, 'No tokens returned from walker');
		});

		it('should attach the original AST node if option `attachNodes` is true', function() {
			var sampleTree = readFileAsAst('all.js');
			var tokens = TreeWalker.walkTree(sampleTree, {
				attachNodes: true
			});

			assert.notEqual(tokens.length, 0, 'No tokens returned from walker');
			assert(tokens[0].sourceNode !== undefined);
			assert(tokens[0].parentNode !== undefined);
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
			var stub = runStubOnFile('controller.js');

			assert(typeof stub.controllers.FooController === 'function', 'Controller declaration not found');
			assert.deepEqual(stub.controllers.FooController.$inject, ['$scope'], 'Controller dependencies not declared');
		});

		it('should declare directives', function() {
			var stub = runStubOnFile('directive.js');

			assert(typeof stub.directives.sample === 'function', 'Directive declaration not found');
			assert.deepEqual(stub.directives.sample.$inject, ['$compile'], 'Directive dependencies not declared');
		});

		it('should declare filters', function() {
			var stub = runStubOnFile('filter.js');

			assert(typeof stub.filters.double === 'function', 'Filter declaration not found');
			assert.deepEqual(stub.filters.double.$inject, ['MathHelper'], 'Filter dependencies not declared');
		});

		it('should declare services', function() {
			var stub = runStubOnFile('services.js');

			assert(typeof stub.services.DomainService === 'function', 'Service declaration not found');
			assert.deepEqual(stub.services.DomainService.$inject, ['$http', '$q', 'CONST_ONE'], 'Service dependencies not declared');

			assert(typeof stub.factories.FunctionFactory === 'function', 'Factory declaration not found');
			assert.deepEqual(stub.factories.FunctionFactory.$inject, ['DomainService'], 'Factory dependencies not declared');

			assert(typeof stub.providers.SomeProvider === 'function', 'Provider declaration not found');
			assert.deepEqual(stub.providers.SomeProvider.$inject, ['$locationProvider'], 'Provider dependencies not declared');
		});

		it('should declare animations', function() {
			var stub = runStubOnFile('animation.js');
			var animationName = '.fade-in';

			assert(typeof stub.animations[animationName] === 'function', 'Animation not found');
			assert.deepEqual(stub.animations[animationName].$inject, ['$injector'], 'Animation dependencies not declared');
		});

		it('should declare constants', function() {
			var stub = runStubOnFile('staticValues.js');

			assert(stub.constants.THE_WORD === 'bird', 'Constant "THE_WORD" not found');
			assert(stub.constants.PI === 3.14, 'Constant "PI" not found');
			assert(stub.values.foo === 'foo', 'Value "foo" not found');
			assert(stub.values.level === 9000, 'Value "level" not found');
		});

		it('should declare config and run blocks', function() {
			var stub = runStubOnFile('configAndRun.js');

			assert(typeof stub.configBlocks[0] === 'function', 'Config block not found');
			assert(typeof stub.runBlocks[0] === 'function', 'Run block not found');
		});
	});
});

function readFileAsAst(file) {
	var sampleCode = fs.readFileSync(__dirname + '/samples/' + file, 'utf8');
	var tree = esprima.parse(sampleCode, esprimaOptions);

	// for optimization only. the comments won't be traversed during the tests
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
