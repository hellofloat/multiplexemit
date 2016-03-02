#!/usr/bin/env node

'use strict';

const async = require( 'async' );
const path = require( 'path' );
const glob = require( 'glob' );

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

        const test = require( path.resolve( process.cwd(), file ) );
        test( next );
    }, function( error ) {
        if ( error ) {
            console.error( error );
            process.exit( 1 );
        }
    } );
} );
