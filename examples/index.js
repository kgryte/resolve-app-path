'use strict';

var path = require( 'path' ),
	root = require( './../lib' );

var parts = root().split( path.sep );
console.log( parts );
