(function() {

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

})();
