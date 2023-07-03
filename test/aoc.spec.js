import { deepStrictEqual } from 'assert'
import { runFromCompiled, runFromInterpreted } from '../src/utils.js'
import { readFileSync } from 'fs'
import std from '../lib/std.js'
const STD = std.split(`; exports`)[0].split('; modules')[1]
const day = (day) => readFileSync(`./examples/aoc_2020_${day}.lisp`, 'utf-8')
const problems = [
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
  day(11),
]
it('Should compile aoc 2020', () =>
  problems
    .map((x) => `(function std (Array 0 length)) ${STD} ${x}`)
    .forEach((source) =>
      deepStrictEqual(runFromInterpreted(source), runFromCompiled(source))
    ))
it('Should solve aoc 2020 tasks', () =>
  deepStrictEqual(
    problems
      .map((x) => `(function std (Array 0 length)) ${STD} ${x}`)
      .map((source) => runFromCompiled(source)),
    [
      [514579, 241861950],
      [2, 1],
      [7, 336],
      [2, 2],
      [820, 118],
      [11, 6],
      [4, 0, 32, 126, 8, 2, 6, 8, 674],
      [5, 8],
      [127, 62],
      [35, 8, 8],
      [37, 26],
    ]
  ))
