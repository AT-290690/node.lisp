import { deepStrictEqual } from 'assert'
import { runFromCompiled, runFromInterpreted } from '../src/utils.js'
import std from '../lib/std.js'
const STD = std.split(`; exports`)[0].split('; modules')[1]
const programs = [
  `
  (import std "is-prime" "sqrt" "map")
  (do
    (Array 2 3 5 7 11 10 2563 1 48 1729) 
    (map (lambda x _ _ (is-prime x))))
`,
  `
(import std "push" "concat" "quick-sort")
(do
  (Array 3 0 5 3 2 4 1) 
  (quick-sort))
`,
  `(import std "round" "floor")
(Array (round 1.5) (floor 1.5) (round 1.2) (floor 1.2) (round 1.7) (floor 1.7))`,
  `(import std "reverse")
(reverse (Array 1 2 3 4 5))
`,
  `(import std "greatest-common-divisor") 
(Array (greatest-common-divisor 12 8))
`,
  `(import std "greatest-common-divisor" "every" "adjacent-difference" "is-prime" "sqrt") 
(defun is-array-of-coprime-pairs inp (and 
  (do inp (every (lambda x _ _ (is-prime x)))) 
  (do inp (adjacent-difference (lambda a b (greatest-common-divisor a b))) (cdr) (every (lambda x _ _ (= x 1))))))
  (Array (is-array-of-coprime-pairs (Array 7 13 59 31 19)))
  `,
]
describe('Standart Library', () => {
  it('Should compile matching interpretation', () =>
    programs
      .map((x) => `(defun std ()) ${STD} ${x}`)
      .forEach((source) =>
        deepStrictEqual(runFromInterpreted(source), runFromCompiled(source))
      ))
  it('Should be correct', () =>
    deepStrictEqual(
      programs
        .map((x) => `(defun std ()) ${STD} ${x}`)
        .map((source) => runFromCompiled(source)),
      [
        [1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
        [0, 1, 2, 3, 3, 4, 5],
        [2, 1, 1, 1, 2, 1],
        [5, 4, 3, 2, 1],
        [4],
        [1],
      ]
    ))
})
