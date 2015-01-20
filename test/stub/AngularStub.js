function AngularStub(fn) {
	this.fn = fn;
	this.controllers = {};
	this.filters = {};
	this.directives = {};
	this.constants = {};
	this.values = {};
	this.animations = {};
	this.services = {};
	this.factories = {};
	this.providers = {};
	this.configBlocks = [];
	this.runBlocks = [];
}

function runWithStub() {
	this.fn.call(null, this);
}

function createStubMethod(propertyToAssign) {
	return function(name, value) {
		if (Array.isArray(this[propertyToAssign])) {
			this[propertyToAssign].push(name);
		} else {
			this[propertyToAssign][name] = value;
		}
	};
}

AngularStub.prototype = {
	constructor: AngularStub,
	runStub: runWithStub,

	config: createStubMethod('configBlocks'),
	run: createStubMethod('runBlocks'),

	animation: createStubMethod('animations'),
	controller: createStubMethod('controllers'),
	directive: createStubMethod('directives'),
	filter: createStubMethod('filters'),
	service: createStubMethod('services'),
	factory: createStubMethod('factories'),
	provider: createStubMethod('providers'),
	constant: createStubMethod('constants'),
	value: createStubMethod('values')
}

module.exports = AngularStub;
