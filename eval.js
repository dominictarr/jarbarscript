
module.exports = E//val

var operators = {
  "<": function (a, b) {
    return E(a, this) < E(b, this)
  },
  "<=": function (a, b) {
    return E(a, this) <= E(b, this)
  },
  ">": function (a, b) {
    return E(a, this) > E(b, this)
  },
  ">=": function (a, b) {
    return E(a, this) >= E(b, this)
  },
  "==": function (a, b) {
    return E(a, this) == E(b, this)
  },
  "!==": function (a, b) {
    return E(a, this) !== E(b, this)
  },
  "!=": function (a, b) {
    return E(a, this) !== E(b, this)
  },
  "===": function (a, b) {
    return E(a, this) === E(b, this)
  },
  '&&': function (a, b) {
    return E(a, this) && E(b, this)
  },
  '||': function (a, b) {
    return E(a, this) || E(b, this)
  },
  '?:': function (a, b, c) {
    return E(a, this) ? E(b, this) : E(c, this)
  },
  '!': function (a) {
    return !E(a, this)
  },
  '!!': function (a) {
    return !!E(a, this)
  },
  '.': function (a, b) {
    return E(a, this)[E(b, this)]
  },
  '$': function () {
    var l = arguments.length
    var env = this
    for(var i = 0; i < l; i++)
      env = env[arguments[i]]
    return env
  },
  ',': function () {
    var l = arguments.length
    var last
    for(var i = 0; i < l; i++)
      last= E(arguments[i], this)
    return last
  },
  '{}': function () {
    var l = arguments.length
    var obj = {}
    for(var i = 0; i < l; i += 2) {
      obj[arguments[i]] = E(arguments[i+1], this)
    }
    return obj
  },
  '[]': function () {
    return [].slice.call(arguments).map(E.bind(this))
  },
  '()': function () {
    var env = this
    var fun = arguments[0]
    var context
    if(fun[0] === '$' && fun.length > 2) {
      context = E(fun.slice(0, fun.length - 1), this)
      fun = context[fun[fun.length - 1]]
    }
    else if(fun[0] === '.') {
      context = E(fun[1], this)
      fun = context[fun[2]]
    }
    else
      fun = E(fun, this)

    var args = [].slice.call(arguments, 1)
        .map(function (arg) { return E(arg, env) })

    return fun.apply(context, args)
  }
}

var isArray = Array.isArray

//eval
function E(list, env) {
  env = env || this
  if(!isArray(list)) return list

  var name = list[0]
  var op = operators[name]
  if(!op)
    throw new Error('unknown operator:' + name)

  if(!op.length) //operator takes an arbitary number of args. only [] so far)

  if(op.length && op.length !== list.length)
    throw new Error('operator:'+name + ' expects ' + op.length + ' arguments, but got:' + list.length)

  if(!list.length)
    throw new Error('operator:'+name + ' must have at least 1 argument')

  return op.apply(env, list.slice(1))
}

