import { deepStrictEqual } from 'assert'
import { runFromCompiled, runFromInterpreted } from '../src/utils.js'
import { readFileSync } from 'fs'
const std = readFileSync('./lib/std.lisp', 'utf-8')
  .split(`; exports`)[0]
  .split('; modules')[1]
const day = (day) => readFileSync(`./examples/aoc_2020_${day}.lisp`, 'utf-8')
it('Should solve aoc 2020 tasks', () =>
  [
    day(1),
    day(2),
    day(3),
    day(4),
    day(5),
    day(6),
    day(7),
    day(8),
    day(9),
    day(10),
  ]
    .map((x) => `(function std (Array 0 length)) ${std} ${x}`)
    .forEach((source) =>
      deepStrictEqual(runFromInterpreted(source), runFromCompiled(source))
    ))
