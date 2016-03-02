'use strict';

const async = require( 'async' );
const EventEmitter = require( 'events' );
const multiplexemit = require( '../index.js' );
const test = require( 'tape' );

module.exports = function( callback ) {

    async.series( [
        function( next ) {
            let sourceEmitter = Object.assign( {}, EventEmitter.prototype );
            let otherEmitter1 = Object.assign( {}, EventEmitter.prototype );

            test( 'multiplex to a single other emitter', function( t ) {
                let watchdog = setTimeout( function() {
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
            let sourceEmitter = Object.assign( {}, EventEmitter.prototype );
            let otherEmitter1 = Object.assign( {}, EventEmitter.prototype );

            test( 'unmultiplex', function( t ) {
                let watchdog = setTimeout( function() {
                    t.fail( 'timed out' );
                    t.end();
                    next( 'timed out' );
                }, 1000 );

                multiplexemit.multiplex( sourceEmitter, otherEmitter1 );

                let called = 0;
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
            let sourceEmitter = Object.assign( {}, EventEmitter.prototype );
            let otherEmitter1 = Object.assign( {}, EventEmitter.prototype );
            let otherEmitter2 = Object.assign( {}, EventEmitter.prototype );
            let otherEmitter3 = Object.assign( {}, EventEmitter.prototype );

            test( 'multiplex to more than one other emitter', function( t ) {
                let watchdog = setTimeout( function() {
                    t.fail( 'timed out' );
                    t.end();
                    next( 'timed out' );
                }, 1000 );

                multiplexemit.multiplex( sourceEmitter, otherEmitter1 );
                multiplexemit.multiplex( sourceEmitter, otherEmitter2 );
                multiplexemit.multiplex( sourceEmitter, otherEmitter3 );

                let handled = 0;
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
            let sourceEmitter = Object.assign( {}, EventEmitter.prototype );
            let otherEmitter1 = Object.assign( {}, EventEmitter.prototype );
            let otherEmitter2 = Object.assign( {}, EventEmitter.prototype );
            let otherEmitter3 = Object.assign( {}, EventEmitter.prototype );

            test( 'unmultiplex more than one other emitter', function( t ) {
                let watchdog = setTimeout( function() {
                    t.fail( 'timed out' );
                    t.end();
                    next( 'timed out' );
                }, 1000 );

                multiplexemit.multiplex( sourceEmitter, otherEmitter1 );
                multiplexemit.multiplex( sourceEmitter, otherEmitter2 );
                multiplexemit.multiplex( sourceEmitter, otherEmitter3 );

                let handled = 0;
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
