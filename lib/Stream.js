/* jshint node: true */
'use strict';

var BufferStreams = require('bufferstreams'),
	Buffer = require('buffer').Buffer,
	Stream = require('stream').Stream,
	through = require('through2'),
	Runner = require('./Runner');

module.exports = function Stream() {
	function transform(file, enc, cb) {
		/* jshint validthis:true */
		var self = this,
			wasBuffer = false;

		if (isBuffer(file)) {
			file = {
				contents: file
			};

			wasBuffer = true;
		}

		if (isNull(file && file.contents || null)) {
			cb(null, file);
			return;
		}

		function processContent(contents, done) {
			var result = null;

			try {
				result = Runner.runOnString(String(contents));
				done(null, new Buffer(result));
			} catch (e) {
				done(e);
			}
		}

		if (isStream(file.contents)) {
			file.contents = file.contents.pipe(new BufferStreams(function(none, buf, done) {
				processContent(buf, function(err, contents) {
					process.nextTick(function() {
						if (err) {
							self.emit('error', err);
							done(err);
						} else {
							done(null, contents);
							self.push(wasBuffer ? file.contents : file);
						}
						cb();
					});
				});
			}));
			return;
		}

		processContent(file.contents, function(err, contents) {
			process.nextTick(function() {
				if (err) {
					self.emit('error', err);
				} else {
					file.contents = contents;
					self.push(wasBuffer ? file.contents : file);
				}
				cb();
			});
		});
	}

	return through.obj(transform);
};


function isBuffer(o) {
	return typeof o === 'object' && o instanceof Buffer;
}

function isNull(o) {
	return o === null;
}

function isStream(o) {
	return !!o && o instanceof Stream;
}
