'use strict';

// MODULES //

var exists = require( 'utils-fs-exists' ).sync,
	path = require( 'path' ),
	cwd = require( 'utils-cwd' );


// PACKAGE DIR //

/**
* FUNCTION: pkgdir()
*	Returns the nearest directory containing a `package.json` starting from the current working directory and walking up.
*
* @returns {String|Null} directory or null
*/
function pkgdir() {
	var parts,
		len,
		str,
		i;

	parts = cwd().split( path.sep );
	len = parts.length;
	for ( i = 0; i < len; i++ ) {
		str = parts.join( path.sep );
		if ( exists( path.join( str, 'package.json' ) ) ) {
			return str;
		}
		parts.pop();
	}
	return null;
} // end FUNCTION pkgdir()


// EXPORTS //

module.exports = pkgdir;
