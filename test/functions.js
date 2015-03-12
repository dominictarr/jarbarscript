
// allow the user only to call functions that have been provided.
var tape = require('tape')

var jarbar = require('../')
var util = require('../util')
var parse = require('../parse')



tape('unsafe calls', function (t) {

  function isUnsafe (code) {
    var ast = parse(code)
    console.log(ast)
    t.throws(function () { util.safeCalls(ast) })
  }

//  isUnsafe('[].reduce.constructor("console.log(1)")()')
  isUnsafe('String.prototype.split.call("1,2,3", ",")')
  isUnsafe('({okay: true}).__proto__.toString()', {})

  t.end()
})

tape('safe call', function (t) {
  var ast = parse('Math.random()', {Math: Math})

  util.safeCalls(ast)

  t.end()
})

//console.log(jarbar())
