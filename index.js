'use strict';

module.exports = {
    multiplex: function( originalEmitter, otherEmitter, namespace, separator ) {

        originalEmitter.__multiplexEmitterList = originalEmitter.__multiplexEmitterList || [];
        originalEmitter.__multiplexEmitterList.push( {
            emitter: otherEmitter,
            namespace: namespace
        } );

        if ( !originalEmitter.__emit ) {
            originalEmitter.__emit = originalEmitter.emit;

            originalEmitter.emit = function() {
                const _arguments = arguments;

                originalEmitter.__emit.apply( originalEmitter, _arguments );

                originalEmitter.__multiplexEmitterList.forEach( function( emitterInfo ) {

                    let args = _arguments;
                    if ( typeof emitterInfo.namespace === 'string' && emitterInfo.namespace.length ) {
                        args = Array.prototype.slice.call( _arguments, 0 );
                        let eventName = args.shift();
                        eventName = emitterInfo.namespace + ( typeof separator !== 'undefined' ? separator : '.' ) + eventName;
                        args.unshift( eventName );
                    }

                    emitterInfo.emitter.emit.apply( emitterInfo.emitter, args );
                } );
            };
        }
    },

    unmultiplex: function( originalEmitter, otherEmitter, namespace ) {
        if ( !originalEmitter.__multiplexEmitterList ) {
            return;
        }

        originalEmitter.__multiplexEmitterList = originalEmitter.__multiplexEmitterList.filter( function( emitterInfo ) {
            return !( emitterInfo.emitter === otherEmitter && emitterInfo.namespace === namespace );
        } );

        if ( originalEmitter.__multiplexEmitterList.length === 0 ) {
            delete originalEmitter.__multiplexEmitterList;
            originalEmitter.emit = originalEmitter.__emit;
            delete originalEmitter.__emit;
        }
    }
};
