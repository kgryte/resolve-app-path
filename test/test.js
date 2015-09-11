/* global require, describe, it */
'use strict';

var mpath = './../lib';


// MODULES //

var chai = require( 'chai' ),
	path = require( 'path' ),
	cwd = require( 'utils-cwd' ),
	proxyquire = require( 'proxyquire' ),
	resolve = require( mpath );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'resolve-app-path', function tests() {

	var root = path.resolve( __dirname, '..' );

	it( 'should export a function', function test() {
		expect( resolve ).to.be.a( 'function' );
	});

	it( 'should handle the case where this module is loaded from a global path', function test() {
		var resolve,
			dir;

		// Simulate this module being loaded from a global path...

		resolve = proxyquire( mpath, {
			'node-global-paths': gpaths()
		});

		dir = resolve();
		assert.strictEqual( dir, root );

		function gpaths() {
			return [
				root.split( path.sep ).slice( 0,3 ).join( path.sep )
			];
		}
	});

	it( 'should handle the case where this module is loaded from a global path but are unable to resolve a parent package', function test() {
		var filename,
			resolve,
			dir;

		// Simulate this module being loaded from a global path and the working directory not having a `package.json` or a parent having a `package.json`...

		resolve = proxyquire( mpath, {
			'node-global-paths': gpaths(),
			'./pkgdir.js': pkgdir
		});

		// Change the main file to a fake file:
		filename = require.main.filename;
		require.main.filename = path.join( root, 'index.js' );

		dir = resolve();
		assert.strictEqual( dir, root );

		// Restore the main filename:
		require.main.filename = filename;

		function gpaths() {
			return [
				root.split( path.sep ).slice( 0,3 ).join( path.sep )
			];
		}

		function pkgdir() {
			return null;
		}
	});

	it( 'should handle the case where this module is a module dependency', function test() {
		var resolve,
			dir;

		// Simulate this module being a module dependency...

		resolve = proxyquire( mpath, {
			'path': {
				'sep': path.sep,
				'resolve': pathResolve
			}
		});

		dir = resolve();
		assert.strictEqual( dir, root );

		function pathResolve( dirname ) {
			dirname = path.join( root, 'node_modules', 'resolve-app-path' );
			return dirname;
		}
	});

	it( 'should handle the case where this module is not a module dependency but is located in a child directory of a module', function test() {
		var resolve,
			dir;

		// Simulate an alternative dependency pattern, where this module is not located in a `node_modules` directory...

		resolve = proxyquire( mpath, {
			'path': {
				'sep': path.sep,
				'resolve': pathResolve
			}
		});

		dir = resolve();
		assert.strictEqual( dir, root );

		function pathResolve() {
			return __dirname;
		}
	});

	it( 'should fall back to just using the main required module', function test() {
		var filename,
			resolve,
			curr,
			dir;

		// Simulate having to resort to a fallback; e.g., this module living in a parent directory and where neither the working directory or its parents contains a package...

		resolve = proxyquire( mpath, {
			'path': {
				'sep': path.sep,
				'resolve': pathResolve
			}
		});

		// Change the cwd:
		curr = cwd();
		process.chdir( path.resolve( curr, '..' ) );

		// Change the main file to a fake file:
		filename = require.main.filename;
		require.main.filename = path.join( root, 'index.js' );

		dir = resolve();
		assert.strictEqual( dir, root );

		// Restore the cwd and main filename:
		process.chdir( curr );
		require.main.filename = filename;

		function pathResolve() {
			// Simulate requiring from a parent directory...
			return path.resolve( root, '..' );
		}
	});

});
