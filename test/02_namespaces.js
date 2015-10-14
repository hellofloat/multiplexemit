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

            test( 'single multiplexed emitter with namespace', function( t ) {
                var watchdog = setTimeout( function() {
                    t.fail( 'timed out' );
                    t.end();
                    next( 'timed out' );
                }, 1000 );

                multiplexemit.multiplex( sourceEmitter, otherEmitter1, 'foo' );

                otherEmitter1.on( 'foo.event', function( event, str ) {
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

            test( 'unmultiplex with namespace', function( t ) {
                multiplexemit.multiplex( sourceEmitter, otherEmitter1, 'foo' );
                multiplexemit.unmultiplex( sourceEmitter, otherEmitter1, 'foo' );

                var called = false;
                otherEmitter1.on( 'foo.event', function() {
                    called = true;
                } );

                setTimeout( function() {
                    if ( called ) {
                        t.fail( 'failed to unmultiplex with namespace' );
                    }
                    else {
                        t.pass( 'unmultiplexed with namespace' );
                    }

                    t.end();
                    next();
                }, 1000 );

                sourceEmitter.emit( 'event' );
            } );
        },

        function( next ) {
            var sourceEmitter = Object.assign( {}, EventEmitter2.prototype );
            var otherEmitter1 = Object.assign( {}, EventEmitter2.prototype );
            var otherEmitter2 = Object.assign( {}, EventEmitter2.prototype );
            var otherEmitter3 = Object.assign( {}, EventEmitter2.prototype );

            test( 'multiple multiplexed emitters with the same namespace', function( t ) {
                var watchdog = setTimeout( function() {
                    t.fail( 'timed out' );
                    t.end();
                    next( 'timed out' );
                }, 1000 );

                multiplexemit.multiplex( sourceEmitter, otherEmitter1, 'foo' );
                multiplexemit.multiplex( sourceEmitter, otherEmitter2, 'foo' );
                multiplexemit.multiplex( sourceEmitter, otherEmitter3, 'foo' );

                var handled = 0;
                function handleEvent( emitterName, event, str ) {
                    t.deepEqual( event, {
                        foo: 'bar',
                        baz: 'yak'
                    }, emitterName + ': event data is correct' );
                    t.equal( str, 'floop', emitterName + ': event second argument is correct' );

                    if ( ++handled === 3 ) {
                        clearTimeout( watchdog );
                        t.end();
                        next();
                    }
                }

                otherEmitter1.on( 'foo.event', handleEvent.bind( null, 'otherEmitter1' ) );
                otherEmitter2.on( 'foo.event', handleEvent.bind( null, 'otherEmitter2' ) );
                otherEmitter3.on( 'foo.event', handleEvent.bind( null, 'otherEmitter3' ) );

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

            test( 'multiple multiplexed emitters with different namespaces', function( t ) {
                var watchdog = setTimeout( function() {
                    t.fail( 'timed out' );
                    t.end();
                    next( 'timed out' );
                }, 1000 );

                multiplexemit.multiplex( sourceEmitter, otherEmitter1, 'foo' );
                multiplexemit.multiplex( sourceEmitter, otherEmitter2, 'bar' );
                multiplexemit.multiplex( sourceEmitter, otherEmitter3, 'baz' );

                var handled = 0;
                function handleEvent( emitterName, event, str ) {
                    t.deepEqual( event, {
                        foo: 'bar',
                        baz: 'yak'
                    }, emitterName + ': event data is correct' );
                    t.equal( str, 'floop', emitterName + ': event second argument is correct' );

                    if ( ++handled === 3 ) {
                        clearTimeout( watchdog );
                        t.end();
                        next();
                    }
                }

                otherEmitter1.on( 'foo.event', handleEvent.bind( null, 'otherEmitter1' ) );
                otherEmitter2.on( 'bar.event', handleEvent.bind( null, 'otherEmitter2' ) );
                otherEmitter3.on( 'baz.event', handleEvent.bind( null, 'otherEmitter3' ) );
                otherEmitter3.on( 'event', function() {
                    t.fail( 'Got a non-namespaced event.' );
                    t.end();
                } );
                otherEmitter3.on( 'foo.event', function() {
                    t.fail( 'Got a an event for the wrong namespace: foo' );
                    t.end();
                } );
                otherEmitter3.on( 'bar.event', function() {
                    t.fail( 'Got a an event for the wrong namespace: bar' );
                    t.end();
                } );

                sourceEmitter.emit( 'event', {
                    foo: 'bar',
                    baz: 'yak'
                }, 'floop' );
            } );
        }
    ], callback );
};
