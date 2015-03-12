
var tape = require('tape')

// okay so I want to translate this AST into
// something that mynsql can search with.
// if the top level is an AND, and there is only one free var, that is
// if there are two free vars we have a join.

