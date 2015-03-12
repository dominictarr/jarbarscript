function ugly (test, test2) {
    if (test) {
      if (test2)
        return {okay: true}

      return {okay: false}
    }
  }




function nice (text, opts) {
  return test ? test2 ? {okay: true} : {okay: false} : undefined
}

var parse = require('acorn').parse

var tree = parse('('+ugly.toString()+')')

console.log(JSON.stringify(tree, null, 2))
