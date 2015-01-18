/* jshint node: true */
'use strict';

var BufferStreams = require('bufferstreams');
var through = require('through2');

module.exports = function(opts, data, options) {
	data = data || {};
	options = options || {};

	function transform(file, enc, cb) {
		/* jshint validthis:true */
		var self = this;

		if (file.isNull()) {
			cb(null, file);
			return;
		}

		function processContent(contents, done) {
			var result = '';
			done(null, result);
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
