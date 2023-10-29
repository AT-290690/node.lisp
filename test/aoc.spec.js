import { deepStrictEqual } from 'assert'
import { runFromCompiled, runFromInterpreted } from '../src/utils.js'
import { readFileSync } from 'fs'
import STD from '../lib/baked/std.js'
import MATH from '../lib/baked/math.js'
import DS from '../lib/baked/ds.js'
import STR from '../lib/baked/str.js'
const day = (day) => readFileSync(`./examples/aoc_2020_${day}.lisp`, 'utf-8')
const libraries = [STD, MATH, DS, STR]
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
  day(12),
  day(13),
  day(14),
  day(15),
  day(16),
  day(17),
  day(18),
  day(19),
  day(20),
  day(21),
]
describe('AOC', () => {
  it('Should compile aoc 2020 problems', () =>
    problems.forEach((source) =>
      deepStrictEqual(
        runFromInterpreted(source, libraries),
        runFromCompiled(source, libraries)
      )
    ))
  it('Should solve aoc 2020 problems', () =>
    deepStrictEqual(
      problems.map((source) => runFromCompiled(source, libraries)),
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
        [25, 286],
        [295, 1835, 1068781, 247086664214628],
        [165n, 208n],
        [0, 0],
        [71, 1716],
        [
          11,
          //  29
        ],
        [26457, 694173],
        [2],
        [20899048083289, 273],
        [5, 'mxmxvkd,sqjhc,fvjkl'],
      ]
    ))
})
