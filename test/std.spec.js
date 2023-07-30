import { deepStrictEqual } from 'assert'
import { runFromCompiled, runFromInterpreted } from '../src/utils.js'
import { STD } from '../lib/std.js'
const programs = [
  `(import std "to-upper-case" "to-lower-case") (Array (to-lower-case "Lisp is Cool AT-29") (to-upper-case "Lisp is Cool AT-29"))`,
  `(import std "map") (go (Array 1 2 4) (map (lambda x . . (* x 2))))`,
  `(import std "is-prime" "sqrt" "map" "abs" "square" "average")
  (go
    (Array 2 3 5 7 11 10 2563 1 48 1729)
    (map (lambda x . . (is-prime x))))`,
  `(import std "push" "concat" "quick-sort")
  (go
    (Array 3 0 5 3 2 4 1)
    (quick-sort))`,
  `(import std "round" "floor")
  (Array (round 1.5) (floor 1.5) (round 1.2) (floor 1.2) (round 1.7) (floor 1.7))`,
  `(import std "reverse")
  (reverse (Array 1 2 3 4 5))`,
  `(import std "greatest-common-divisor")
  (Array (greatest-common-divisor 12 8))`,
  `(import std "greatest-common-divisor" "every" "adjacent-difference" "is-prime" "sqrt" "abs" "square" "average")
  (defun is-array-of-coprime-pairs inp (and
    (go inp (every (lambda x . . (is-prime x))))
    (go inp (adjacent-difference (lambda a b (greatest-common-divisor a b))) (cdr) (every (lambda x . . (= x 1))))))
    (Array (is-array-of-coprime-pairs (Array 7 13 59 31 19)))`,
  `(import std "reduce" "map" "cartesian-product" "merge" "push")
    (cartesian-product (Array "x" "y") (Array 1 2))`,
  `(import std "greatest-common-divisor" "least-common-divisor")
  (Array (greatest-common-divisor 8 36) (least-common-divisor 12 7))`,
  `(import std "arithmetic-progression" "range" "push")
    (Array (arithmetic-progression 5 25) (range 1 10))`,
  `(import std "join" "reduce")
    (go (Array "Hello" "World") (join "-") (Array))`,
  `(import std "power" "factorial" "sqrt" "abs" "square" "average" "round")
    (Array (round (sqrt (power 2 (factorial 4)))))`,
  `(import std "levenshtein-distance" "minimum" "min" "reduce") (Array (levenshtein-distance "duck" "dark"))`,
  ` (import std "round")
      (defun binomial-coefficient n k
        (or (cond
          (or (< k 0) (> k n)) 0
          (or (= k 0) (= k n)) 1
          (or (= k 1) (= k (- n 1))) n) (do
            (when (< (- n k) k) (setf k (- n k)))
            (loop defun iterate i res (if (<= i k) (iterate (+ i 1) (* res (- n i -1) (/ i))) res))
            (round (iterate 2 n)))))
        (Array (binomial-coefficient 8 2))`,
  `(import std "slice" "window" "push" "reduce")
      (Array (window (Array 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16) 4))`,
  `(import std "max-bit" "min-bit" "clamp-bit")
      (Number (max-bit 1 2) (min-bit 1 2) (clamp-bit 100 2 50) (clamp-bit 10 0 20))`,
  `(import std "is-bit-power-of-two" "map" "count-number-of-ones-bit")
    (Array (map (Array 2 4 8 16 32 64 1 3 7 40 49) (lambda x . . (is-bit-power-of-two x))) (count-number-of-ones-bit 23))`,
  `(import std "possible-subsets-bit")
    (Array (possible-subsets-bit (Array "a" "b" "c")))`,
]

describe('Standart Library', () => {
  it('Should compile matching interpretation', () =>
    programs.forEach((source) =>
      deepStrictEqual(
        runFromCompiled(source, STD),
        runFromInterpreted(source, STD)
      )
    ))
  it('Should be correct', () =>
    deepStrictEqual(
      programs.map((source) => runFromInterpreted(source, STD)),
      [
        ['lisp is cool at-29', 'LISP IS COOL AT-29'],
        [2, 4, 8],
        [1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
        [0, 1, 2, 3, 3, 4, 5],
        [2, 1, 1, 1, 2, 1],
        [5, 4, 3, 2, 1],
        [4],
        [1],
        [
          ['x', 1],
          ['x', 2],
          ['y', 1],
          ['y', 2],
        ],
        [4, 84],
        [
          [5, 10, 15, 20, 25],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        ],
        ['Hello-World'],
        [4096],
        [2],
        [28],
        [
          [
            [1, 2, 3, 4],
            [2, 3, 4, 5],
            [3, 4, 5, 6],
            [4, 5, 6, 7],
            [5, 6, 7, 8],
            [6, 7, 8, 9],
            [7, 8, 9, 10],
            [8, 9, 10, 11],
            [9, 10, 11, 12],
            [10, 11, 12, 13],
            [11, 12, 13, 14],
            [12, 13, 14, 15],
          ],
        ],
        [2, 1, 50, 10],
        [[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0], 4],
        [
          [
            [],
            ['a'],
            ['b'],
            ['a', 'b'],
            ['c'],
            ['a', 'c'],
            ['b', 'c'],
            ['a', 'b', 'c'],
          ],
        ],
      ]
    ))
})
