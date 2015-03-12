
var isArray = Array.isArray
var E = require('./eval')

function isFunction (f) {
  return 'function' === typeof f
}

function traverse (ast, iter) {
  if(!isArray(ast)) return

  iter(ast)
  for(var i = 1; i < ast.length; i++)
    traverse(ast[i], iter)
}

//get the list of free variables
exports.freeVars = function (ast) {
  var ary = [], seen = {}

  traverse(ast, function (ast) {
    if(ast[0] == '$') {
      var v = ast.join('.')
      if(!seen[v]) {
        seen[v] = true
        ary.push(ast)
      }
    }
  })

  return ary
}



exports.calls = function (ast) {
  var a = []
  traverse(ast, function (ast) {
    if(ast[0] == '()') {
      a.push(ast)
    }
  })
  return a
}

exports.safeProperties = function (ast) {
  traverse(ast, function (ast) {
    if(ast[0] == '$' && (
        ~ast.indexOf('constructor') ||
        ~ast.indexOf('prototype') ||
        ~ast.indexOf('__proto__')
    ))
      throw new Error('unsafe property access:' + ast.slice(1).join('.'))

    if (ast[0] === '.' && (
        ast[2] === 'constructor' ||
        ast[2] === 'prototype' ||
        ast[2] === '__proto__'
    ))
      throw new Error('unsafe property access: .'+ast[2])

  })
}

exports.safeCalls = function (ast, env) {

  exports.safeProperties(ast)

  //NOTE: this will need to change once lambdas are implemented.
  traverse(ast, function (ast) {
    if(ast[0] == '()') {
      if(ast[1][0] != '$')
        throw new Error('unsafe dynamic function call')

      if(!isFunction(E(ast[1], env)))
        throw new Error('did not point to function')
    }

  })

}
