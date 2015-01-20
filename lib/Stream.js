/* jshint node: true */
'use strict';

var BufferStreams = require('bufferstreams'),
	through = require('through2'),
	Runner = require('./Runner');

module.exports = function() {
	function transform(file, enc, cb) {
		/* jshint validthis:true */
		var self = this;

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		function processContent(contents, done) {
			var result = null;

			try {
				result = Runner.runOnString(String(contents));
				done(null, result);
			} catch (e) {
				done(e);
			}
		}

		if (file.isStream()) {
			file.contents = file.contents.pipe(new BufferStreams(function(none, buf, done) {
				processContent(buf, function(err, contents) {
					process.nextTick(function() {
						if (err) {
							self.emit('error', err);
							done(err);
						} else {
							done(null, contents);
							self.push(file);
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
					self.push(file);
				}
				cb();
			});
		});
	}

	return through.obj(transform);
};
