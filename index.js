'use strict';
var modl = module.exports = require('./lib/index');
modl.version = require('./package.json').version;

/*

var through;
var parseCode = require('./lib/parser');
var generateCode = require('./lib/generator');
var buf = require('buffer');
var Buffer = buf.Buffer;

// could use Buffer.isBuffer but this is the same exact thing...
function isBuffer(o) {
	return typeof o === 'object' && o instanceof Buffer;
}

module.exports = {
	parseStream: function stream() {
		if (!through) {
			through = require('through');
		}

		return through(function write(data) {
			var source = data;

			if (isBuffer(data)) {
				source = data.contents.toString('utf8');
			} else {
				source = data;
			}

			source = new Buffer(generateCode(parseCode(source)));
			this.queue(source);

		}, function end() {
			this.queue(null);
		});
	},

	parseCode: function(code) {
		return generateCode(parseCode(code));
	},

	parser: parseCode,
	generator: generateCode
};
*/
