

var parse = require('../parse')
var E = require('../eval')
var tape = require('tape')

tape('parse expressions', function (t) {
  function is(code, ast) {
    t.deepEqual(parse(code), ast)
  }
  is('foo <= bar ? foo : bar',
    ['?:', ['<=', ['$', 'foo'], ['$', 'bar']],
      ['$', 'foo'],
      ['$', 'bar']
    ]
  )

  is('foo[0]',
    ['$', 'foo', 0]
  )


  //special case for accessing into a named path
  is('foo.bar.baz',
    ['$', 'foo', 'bar', 'baz']
  )

  is('(foo ? bar : baz).qux',
    ['.',
      ['?:', ['$', 'foo'], ['$', 'bar'], ['$', 'baz']],
      'qux'
    ]
  )

  var env = {foo: true,  bar: {qux: 1}, baz: {qux: 2}}
  t.equal(E(parse('(foo ? bar : baz).qux'), env), 1)

  var env2 = {foo: false,  bar: {qux: 1}, baz: {qux: 2}}
  t.equal(E(parse('(foo ? bar : baz).qux'), env2), 2)

  is('(foo, bar, baz)',
    [',', ['$', 'foo'], ['$', 'bar'], ['$', 'baz']]
  )

  is('({foo: 1, bar: 2})',
    ['{}', 'foo', 1, 'bar', 2]
  )

  is("({1: 'foo', 2: 'bar' })",
    ['{}', 1, 'foo', 2, 'bar']
  )

  is("({'***': 'foo', '???': 'bar' })",
    ['{}', '***', 'foo', '???', 'bar']
  )

  t.equal(E(parse('({qux: 1, bar: 2})["qux"]')), 1)

  is("([1, 'foo', 2, 'bar' ])",
    ['[]', 1, 'foo', 2, 'bar']
  )

  t.equal(E(parse('(["qux", 1, "bar", 2])[2]')), 'bar')

  t.end()
})


