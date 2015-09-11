Application Path
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Resolves an application's path.


## Installation

``` bash
$ npm install resolve-app-path
```


## Usage

``` javascript
var resolve = require( 'resolve-app-path' );
```

#### resolve()

Resolves an application's path.

``` javascript
var root = resolve();
// returns <dirpath>
```


## Notes

This module attempts the following strategies for resolving an application path:

*	When this module is a local module dependency, the module looks for an earliest ancestor `node_modules` directory, where we assume that the ancestor's parent is the application root. For example, given the following dependency chain
	```
	/
	└── foo
	    └── bar
	        └── node_modules
	            └── beep
	                └── node_modules
	                    └── resolve-app-path
	                        └── index.js
	```

	the application root is `/foo/bar`.

* 	When this module is loaded from a [global Node path](https://github.com/kgryte/node-global-paths), the module tries to find the nearest `package.json` walking up from the [current working directory](https://github.com/kgryte/utils-cwd). For example, given the following directory structure

	```
	/
	└── Users
	    └── <user>
	        └── .node_modules
	            └── resolve-app-root
	                └── index.js
	└── foo
	    └── bar
	        └── app
	            └── root
	                └── package.json
	                └── bin
	                    └── cli
	```

	and

	``` bash
	$ cd /foo/bar/app/root
	$ node ./bin/cli
	```

	the application root is `/foo/bar/app/root`.

*	When an alternative dependency strategy is used, e.g., copy and paste or this module as a `git` submodule, where this module is not located in a `node_modules` directory, the module also attempts to find the nearest `package.json` walking up from the [current working directory](https://github.com/kgryte/utils-cwd). For example, given the following directory structure,

	```
	/
	└── foo
	    └── bar
	        └── app
	            └── root
	                └── package.json
	                └── libs
	                    └── resolve-app-root
	                        └── index.js
	```

	the application root is `/foo/bar/app/root`.

*	When none of the above methods resolve a root directory, the module uses `require.main.filename` as a fallback. For example, given the following directory structure,

	``` bash
	/
	└── foo
	    └── bar
	        └── app
	            └── root
	                └── index.js
	        └── resolve-app-root
	            └── index.js
	```

	where, in `app/root/index.js`,

	``` javascript
	var root = require( './../../resolve-app-root' );
	```

	and

	``` bash
	$ cd /foo/bar
	$ node ./app/root
	```

	the application root is `/foo/bar/app/root`, as the main requiring file is `index.js` in `/foo/bar/app/root`.



## Examples

``` javascript
var path = require( 'path' ),
	root = require( 'resolve-app-path' );

var parts = root().split( path.sep );
console.log( parts );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/resolve-app-path.svg
[npm-url]: https://npmjs.org/package/resolve-app-path

[travis-image]: http://img.shields.io/travis/kgryte/resolve-app-path/master.svg
[travis-url]: https://travis-ci.org/kgryte/resolve-app-path

[codecov-image]: https://img.shields.io/codecov/c/github/kgryte/resolve-app-path/master.svg
[codecov-url]: https://codecov.io/github/kgryte/resolve-app-path?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/resolve-app-path.svg
[dependencies-url]: https://david-dm.org/kgryte/resolve-app-path

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/resolve-app-path.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/resolve-app-path

[github-issues-image]: http://img.shields.io/github/issues/kgryte/resolve-app-path.svg
[github-issues-url]: https://github.com/kgryte/resolve-app-path/issues
