# angular-di-annotations

AngularJS module syntax generated from code annotations on comments. Yep, crazy stuff.

## How it works

This module will walk over the syntax tree and look for comments that have some special annotation tags and transform this tags into 
AngularJS module calls.

So if you have the code below:

```
// @controller MyController
function ThisIsAController($scope) {
	// ...
}

// @directive
function myDirective($compile) {
	// ...
}

```

It will inject the module declaration as follows:

```
function ThisIsAController($scope) {}

$module.controller('MyController', ThisIsAController);
ThisIsAController.$inject = ['$scope'];

function myDirective($compile) {}

$module.directive('undefined', myDirective);
myDirective.$inject = ['$compile'];
```

[Here is a sample code](https://github.com/darlanalves/angular-di-annotations/blob/master/test/samples/all.js) with all the supported annotations, 


## Why

[There's a post](https://medium.com/@angularjsdev/less-angularjs-more-javascript-ab756cfb81) where I discuss why it may be a good idea.