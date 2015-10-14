
# Multiplex Emit

Allows you to cause an emitter to emit the same event to multiple other emitters, including with namespaces.

## Examples

### Basics

```
require( 'es6-shim' );
var EventEmitter = require( 'events' );
var me = require( 'multiplexemit' );

var primaryEmitter = Object.assign( {}, EventEmitter.prototype );
var multiplexedEmitter = Object.assign( {}, EventEmitter.prototype );

me.multiplex( primaryEmitter, multiplexedEmitter );

// now multiplexedEmitter will get the same events emitted that primaryEmitter does:

multiplexedEmitter.on( 'foo', function() {
    console.log( 'foo' );
} );

primaryEmitter.emit( 'foo' ); // will cause multiplexedEmitter to output 'foo'
```

### Namespaces

```
require( 'es6-shim' );
var EventEmitter = require( 'events' );
var me = require( 'multiplexemit' );

var primaryEmitter = Object.assign( {}, EventEmitter.prototype );
var multiplexedEmitter = Object.assign( {}, EventEmitter.prototype );

me.multiplex( primaryEmitter, multiplexedEmitter, 'namespace' );

// now multiplexedEmitter will get the same events emitted that primaryEmitter does,
// but with the 'namespace' prefix:

multiplexedEmitter.on( 'namespace.foo', function() {
    console.log( 'foo' );
} );

primaryEmitter.emit( 'foo' ); // will cause multiplexedEmitter to ouput 'foo'
```

## License

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
