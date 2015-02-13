# angular-di-annotations

AngularJS module syntax generated from code annotations on comments. Yep, crazy stuff.

## Why

[There's a post](https://medium.com/@angularjsdev/less-angularjs-more-javascript-ab756cfb81) where I discuss why it may be a good idea.

[See this sample file](https://github.com/darlanalves/angular-di-annotations/blob/master/test/samples/all.js) with all the supported annotations

## How it works

This module will walk over the syntax tree and look for comments that have some special annotation tags and transform this tags into 
AngularJS module calls.

So if you have the code below:

```
/**
 * @module foo
 * @controller MyController
 */
function ThisIsAController($scope) {
	// ...
}

/**
 * @module foo
 * @directive
 */
function myDirective($compile) {
	// ...
}

```

You will run the JS script through this library and it will inject the AngularJS module syntax as follows:

```
function ThisIsAController($scope) {}

angular.module('foo').controller('MyController', ThisIsAController);
ThisIsAController.$inject = ['$scope'];

function myDirective($compile) {}

angular.module('foo').directive('myDirective', myDirective);
myDirective.$inject = ['$compile'];
```

## API

### runOnString(string);

```javascript
var annotations = require('angular-di-annotations').Runner;
var code = annotations.runOnString(code);

```

### runOnFile(filePath);

```javascript
var annotations = require('angular-di-annotations').Runner;
var code = annotations.runOnFile('/path/to/file.js');

```

## Node.JS vanilla fs

```javascript
var stream = require('angular-di-annotations').Stream;
var fs = require('fs');

fs.createReadStream('./input.js').pipe(stream()).pipe(fs.createWriteStream('./output.js'));
```

## Gulp

```javascript
var gulp = require('gulp'),
	annotations = require('angular-di-annotations').Stream;

gulp.task('annotate', function() {
	gulp.src('./input/*.js')
		.pipe(annotations())
		.pipe(gulp.dest('./output/'));
});
```

## Shell

```bash

cat input.js | ngannotations

ngannotations -i input.js > output.js

ngannotations -i input.js -o output.js
```

## Changing the generated code

You can change the syntax generated on this module modifying tree constants before running it.
These are their default values:

	```
	RUNNABLE: "%module%.%type%(%value%);",
	INJECTABLE: "%module%.%type%('%name%', %value%);",
	MODULE: "angular.module('%name%')"
	```

You could use, for example, a syntax that binds to a global variable that points to your module:

```javascript
// source file

/**
 * @controller
 */
function FooController() {}
```

```javascript
var annotations = require('angular-di-annotations'),
	runner = annotations.Runner,
	constants = annotations.constants;

constants.MODULE = 'myModule';

var generatedCode = runner.runOnString(source);

```

This way the final code will look like this:

```
function FooController() {}
myModule.controller('FooController', FooController);
```