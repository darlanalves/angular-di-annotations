var logger = {
	enabled: false,
	throwErrors: false,

	log: function() {
		if (logger.enabled) {
			console.log.apply(console, arguments);
		}
	},

	error: function() {
		if (!logger.enabled) return;

		var args = Array.prototype.slice.call(arguments);

		if (logger.throwErrors) {
			throw new Error(args.join(' '));
		} else {
			args.unshift(' ! ');
			console.log.apply(console, args);
		}
	}
};

module.exports = logger;
