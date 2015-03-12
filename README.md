# jarbarscript

Interpreter for turing-INCOMPLETE subset of javascript (comparison expressions)

pronounciation guide:

https://twitter.com/thoward37/status/575740274560753664

Basically, you can implement expressions, but not assignment, declaration,
functions, or loops. Just < > <= >= == === != !== ! ?: () . , {} (object literals) and [] array literals (and object access).

Okay, so you just implemented a very partial javascript interpreter _in javascript_ are you crazy?
what is the point of this?

Maybe. And sometimes you want user provided code, but you do not
want to run arbitary untrusted code. This provides a flexible, familiar
syntax for filtering stuff, but does not let a user provided function own you.

Also, maybe you want to be able to introspect that javascript efficiently,
and then do something clever with it...

All jarbarscript code has predictable execution time, because there are
no loops or recursion!

``` js
var jarbar = require('jarbarscript')

jarbar('foo < bar', {foo: 1, bar: 2}) => true
jarbar('foo < bar ? 1 : -1', {foo: 1, bar: 2}) => 1
jarbar('foo.bar', {foo: {bar: 'QUX'}}) => 'QUX'
```

etc,

## License

MIT
