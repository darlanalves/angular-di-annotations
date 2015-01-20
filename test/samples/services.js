(function() {
	/**
	 * @service DomainService
	 */
	function DomainService($http, $q, CONST_ONE) {
		/**
		 * Find one item
		 * @param {String} id Item to search for
		 */
		function findOne(id) {}

		return {
			findOne: findOne
		};
	}

	/**
	 * @factory FunctionFactory
	 */
	function FunctionFactory(DomainService) {
		return function() {
			DomainService.findOne(1);
		};
	}

	/**
	 * @provider SomeProvider
	 */
	function SomeProvider($locationProvider) {
		$locationProvider.html5Mode(true);

		this.$get = function() {};
	}

})();
