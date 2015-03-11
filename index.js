
var parse = require('./parse')
var E = require('./eval')
module.exports = function (code, env) {
  return E(parse(code), env)
}
