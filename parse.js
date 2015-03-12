
//substack told me he prefered acorn
//because he agreed with their release policy more.
//so I am using that instead of esprima.
//the tree structure it returns is compatible though.
var esprima = require('acorn')

var isArray = Array.isArray

var types = {
  Program: function (esp) { return ast(esp.body[0]) },
  ExpressionStatement: function (esp) {
    return ast(esp.expression)
  },
  ConditionalExpression: function (esp) {
    return ['?:', ast(esp.test), ast(esp.consequent), ast(esp.alternate)]
  },
  BinaryExpression: function (esp) {
    return [esp.operator, ast(esp.left), ast(esp.right)]
  },
  Identifier: function (esp) {
    return ['$', esp.name]
  },
  Literal: function (esp) {
    return esp.value
  },
  MemberExpression: function (esp) {
    var prop = esp.property.type === 'Identifier' ? esp.property.name : ast(esp.property)
    var obj = ast(esp.object)
    if(obj[0] == '$' && !isArray(prop))
      return obj.concat(prop)
    else
      return ['.', obj, prop]
  },
  SequenceExpression: function (esp) {
    return [','].concat(esp.expressions.map(ast))
  },
  ObjectExpression: function (esp) {
    var a = ['{}']
    esp.properties.forEach(function (prop) {
      a.push(prop.key.name || prop.key.value)
      a.push(ast(prop.value))
    })
    return a
  },
  ArrayExpression: function (esp) {
    return ['[]'].concat(esp.elements.map(ast))
  }
}

function ast (esp) {
  var type = types[esp.type]
  if(!type) {
    console.error('could not parse:')
    console.error(JSON.stringify(esp, null, 2))
    throw new Error('no handler for type:' + esp.type)
  }
  return type(esp)
}

module.exports = function (code) {
  return ast(esprima.parse(code))
}
