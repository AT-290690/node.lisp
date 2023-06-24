import { deepStrictEqual } from 'assert'
import { runFromCompiled, runFromInterpreted } from '../src/utils.js'
import { readFileSync } from 'fs'
const std = readFileSync('./lib/std.lisp', 'utf-8')
  .split(`; exports`)[0]
  .split('; modules')[1]

it('Should solve aoc 2020 tasks', () =>
  [
    readFileSync('./examples/aoc_2020_1.lisp', 'utf-8'),
    readFileSync('./examples/aoc_2020_2.lisp', 'utf-8'),
    readFileSync('./examples/aoc_2020_3.lisp', 'utf-8'),
    readFileSync('./examples/aoc_2020_4.lisp', 'utf-8'),
    readFileSync('./examples/aoc_2020_5.lisp', 'utf-8'),
    readFileSync('./examples/aoc_2020_6.lisp', 'utf-8'),
    readFileSync('./examples/aoc_2020_7.lisp', 'utf-8'),
    readFileSync('./examples/aoc_2020_8.lisp', 'utf-8'),
  ]
    .map((x) => `(function std (Array 0 length)) ${std} ${x}`)
    .forEach((source) =>
      deepStrictEqual(runFromInterpreted(source), runFromCompiled(source))
    ))
