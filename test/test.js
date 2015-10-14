#!/usr/bin/env node

'use strict';

var async = require( 'async' );
var path = require( 'path' );
var glob = require( 'glob' );

glob( path.join( __dirname, '*.js' ), function( error, files ) {
    if ( error ) {
        console.error( error );
        process.exit( 1 );
    }

    async.eachSeries( files, function( file, next ) {
        // skip this file
        if ( file === __filename ) {
            next();
            return;
        }

        var test = require( path.resolve( process.cwd(), file ) );
        test( next );
    }, function( error ) {
        if ( error ) {
            console.error( error );
            process.exit( 1 );
        }
    } );
} );
