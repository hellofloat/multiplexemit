'use strict';

require( 'es6-shim' );
var async = require( 'async' );
var EventEmitter2 = require( 'eventemitter2' ).EventEmitter2;
var multiplexemit = require( '../index.js' );
var test = require( 'tape' );

module.exports = function( callback ) {

    async.series( [
        function( next ) {
            var sourceEmitter = Object.assign( {}, EventEmitter2.prototype );
            var otherEmitter1 = Object.assign( {}, EventEmitter2.prototype );

            test( 'multiplex to a single other emitter', function( t ) {
                var watchdog = setTimeout( function() {
                    t.fail( 'timed out' );
                    t.end();
                    next( 'timed out' );
                }, 1000 );

                multiplexemit.multiplex( sourceEmitter, otherEmitter1 );

                otherEmitter1.on( 'event', function( event, str ) {
                    clearTimeout( watchdog );
                    t.deepEqual( event, {
                        foo: 'bar',
                        baz: 'yak'
                    }, 'event data is correct' );
                    t.equal( str, 'floop', 'event second argument is correct' );
                    t.end();

                    next();
                } );

                sourceEmitter.emit( 'event', {
                    foo: 'bar',
                    baz: 'yak'
                }, 'floop' );
            } );
        },

        function( next ) {
            var sourceEmitter = Object.assign( {}, EventEmitter2.prototype );
            var otherEmitter1 = Object.assign( {}, EventEmitter2.prototype );

            test( 'unmultiplex', function( t ) {
                var watchdog = setTimeout( function() {
                    t.fail( 'timed out' );
                    t.end();
                    next( 'timed out' );
                }, 1000 );

                multiplexemit.multiplex( sourceEmitter, otherEmitter1 );

                var called = 0;
                otherEmitter1.on( 'event', function() {
                    if ( ++called === 2 ) {
                        t.fail( 'called a second time' );
                        t.end();
                        next();
                        return;
                    }

                    clearTimeout( watchdog );
                    watchdog = setTimeout( function() {
                        if ( called === 1 ) {
                            t.pass( 'successfully removed multiplexed emitter' );
                            t.end();
                            next();
                        }
                    } );

                    multiplexemit.unmultiplex( sourceEmitter, otherEmitter1 );
                    sourceEmitter.emit( 'event' );
                } );

                sourceEmitter.emit( 'event' );
            } );
        },

        function( next ) {
            var sourceEmitter = Object.assign( {}, EventEmitter2.prototype );
            var otherEmitter1 = Object.assign( {}, EventEmitter2.prototype );
            var otherEmitter2 = Object.assign( {}, EventEmitter2.prototype );
            var otherEmitter3 = Object.assign( {}, EventEmitter2.prototype );

            test( 'multiplex to more than one other emitter', function( t ) {
                var watchdog = setTimeout( function() {
                    t.fail( 'timed out' );
                    t.end();
                    next( 'timed out' );
                }, 1000 );

                multiplexemit.multiplex( sourceEmitter, otherEmitter1 );
                multiplexemit.multiplex( sourceEmitter, otherEmitter2 );
                multiplexemit.multiplex( sourceEmitter, otherEmitter3 );

                var handled = 0;
                function handleEvent( event, str ) {
                    if ( ++handled === 3 ) {
                        clearTimeout( watchdog );

                        t.deepEqual( event, {
                            foo: 'bar',
                            baz: 'yak'
                        }, 'event data is correct' );
                        t.equal( str, 'floop', 'event second argument is correct' );
                        t.end();
                        next();
                    }
                }

                otherEmitter1.on( 'event', handleEvent );
                otherEmitter2.on( 'event', handleEvent );
                otherEmitter3.on( 'event', handleEvent );

                sourceEmitter.emit( 'event', {
                    foo: 'bar',
                    baz: 'yak'
                }, 'floop' );
            } );
        },

        function( next ) {
            var sourceEmitter = Object.assign( {}, EventEmitter2.prototype );
            var otherEmitter1 = Object.assign( {}, EventEmitter2.prototype );
            var otherEmitter2 = Object.assign( {}, EventEmitter2.prototype );
            var otherEmitter3 = Object.assign( {}, EventEmitter2.prototype );

            test( 'unmultiplex more than one other emitter', function( t ) {
                var watchdog = setTimeout( function() {
                    t.fail( 'timed out' );
                    t.end();
                    next( 'timed out' );
                }, 1000 );

                multiplexemit.multiplex( sourceEmitter, otherEmitter1 );
                multiplexemit.multiplex( sourceEmitter, otherEmitter2 );
                multiplexemit.multiplex( sourceEmitter, otherEmitter3 );

                var handled = 0;
                function handleEvent() {
                    if ( ++handled === 3 ) {
                        clearTimeout( watchdog );
                        watchdog = setTimeout( function() {
                            if ( handled > 3 ) {
                                t.fail( 'failed to remove all multiplexed emitters' );
                                t.end();
                            }
                            else {
                                t.pass( 'unmultiplexed multiple emitters' );
                                t.end();
                            }

                            next();
                        }, 1000 );

                        multiplexemit.unmultiplex( sourceEmitter, otherEmitter1 );
                        multiplexemit.unmultiplex( sourceEmitter, otherEmitter2 );
                        multiplexemit.unmultiplex( sourceEmitter, otherEmitter3 );

                        sourceEmitter.emit( 'event' );
                    }
                }

                otherEmitter1.on( 'event', handleEvent );
                otherEmitter2.on( 'event', handleEvent );
                otherEmitter3.on( 'event', handleEvent );

                sourceEmitter.emit( 'event' );
            } );
        },
    ], callback );
};
