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
	 * @directive sample
	 */
	function sampleDirective($compile) {
		/**
		 * Foo Whoo
		 */
		return {
			restrict: 'E',
			templateUrl: 'sample.html',
			link: linker
		};

		function linker() {
			$compile('<div />');
		}
	}

	/**
	 * @service DomainService
	 */
	function DomainService($http, $q, CONST_ONE) {
		/**
		 * Find one item
		 * @param {String} id Item to search for
		 */
		function findOne(id) {

		}

		return {
			findOne: findOne
		};
	}

	// @value
	var someValue = 10;

	// @const
	var CONST_ONE = 'one';

	/**
	 * @controller FooEditController
	 */
	function FooEditController($scope, $http, DomainService) {
		$scope.save = saveItem;

		// saves the item on scope
		function saveItem(argument) {
			// here's some code for that
		}
	}

})();
