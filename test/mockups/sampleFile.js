(function() {

	/**
	 * @module foo-module
	 * @requires bar, baz, some-other-stuff
	 */

	/**
	 * @filter double
	 */
	function doubleFilter(Foo, Bar) {
		return function double(number) {
			return number * 2;
		};
	}

	/**
	 * @directive ctSample
	 */
	function ctSampleDirective($compile) {
		/**
		 * Foo Whoo
		 */
		return {
			restrict: 'E',
			templateUrl: 'sample.html',
			link: linker
		};

		function linker() {
			$compile('');
		}
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

})();
