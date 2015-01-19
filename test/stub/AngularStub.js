function AngularStub(fn) {
	this.fn = fn;
	this.controllers = {};
	this.filters = {};
	this.directives = {};
	this.constants = {};
	this.values = {};
	this.services = {};
	this.factories = {};
	this.providers = {};
}

function runWithStub() {
	// console.log('' + this.fn);
	this.fn.call(null, this);
}

function createStubMethod(propertyToAssign) {
	return function(name, value) {
		this[propertyToAssign][name] = value;
	};
}

AngularStub.prototype = {
	constructor: AngularStub,
	runStub: runWithStub,

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
