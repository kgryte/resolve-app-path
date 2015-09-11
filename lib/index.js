'use strict';

// MODULES //

var path = require( 'path' ),
	gpaths = require( 'node-global-paths' ),
	pkgdir = require( './pkgdir.js' );


// VARIABLES //

var dir = path.resolve( __dirname );


// RESOLVE //

/**
* FUNCTION: resolve()
*	Resolves an application's path.
*
* @returns {String} directory path
*/
function resolve() {
	var parts,
		flg,
		len,
		str,
		i;

	// CASE 1: this module is loaded from a global path...
	len = gpaths.length;
	for ( i = 0; i < len; i++ ) {
		str = dir.substring( 0, gpaths[ i ].length );
		if ( str === gpaths[ i ] ) {
			// We are loaded from a global path. Resort to finding the nearest `package.json` walking up from the current working directory...
			str = pkgdir();
			if ( str ) {
				return str;
			}
			flg = true;
		}
	}
	// CASE 2: this module is a local module dependency; in which case, split on `node_modules`...
	parts = dir.split( path.sep+'node_modules' );
	if ( parts.length > 1 ) {
		// We are a nested module. Assume that the top-level node module directory is the application root...
		return parts[ 0 ];
	}
	// CASE 3: possibly a git submodule, copy and paste, or some other dependency pattern; in which case, find the nearest `package.json` walking up from the current working directory...
	if ( !flg ) {
		str = pkgdir();
		if ( str ) {
			return str;
		}
	}
	// CASE 4: nothing worked. Just use the main module...
	return path.dirname( require.main.filename );
} // end FUNCTION resolve()


// EXPORTS //

module.exports = resolve;
