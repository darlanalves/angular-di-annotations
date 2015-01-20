(function() {
	/**
	 * @filter double
	 */
	function doubleFilter(MathHelper) {
		/**
		 * @param {Number} number The number to multiply
		 */
		function double(number) {
			return MathHelper.double(number);
		}

		return double;
	}
})();
