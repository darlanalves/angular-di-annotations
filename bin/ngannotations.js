#!/usr/bin/env node

'use strict';

var di = require('../lib/');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

var input = (argv.i ? fs.createReadStream(argv.i) : process.stdin);
var output = (argv.o ? fs.createWriteStream(argv.o) : process.stdout);

if (q in argv) {
	di.logger.enabled = false;
}

if (t in argv) {
	di.logger.enabled = true;
	di.logger.throwErrors = true;
}

input.pipe(di.Stream()).pipe(output);
