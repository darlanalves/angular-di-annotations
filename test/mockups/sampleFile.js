/**
 * @module foo-module
 * @requires bar, baz, some-other-stuff
 */

/**
 * @filter fooFilter
 */
function fooFilter(Foo, Bar) {

}

/**
 * @directive ctFooDirective
 */
function ctFooBar($compile) {

}

/**
 * @service DomainService
 */
function DomainService($http, $q, CONST_ONE) {

}

// @value
var someValue = 10;

// @const
var CONST_ONE = 'one';
