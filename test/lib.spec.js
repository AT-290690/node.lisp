import { deepStrictEqual } from 'assert'
import { runFromCompiled, runFromInterpreted } from '../src/utils.js'
import STD from '../lib/baked/std.js'
import STR from '../lib/baked/str.js'
import MATH from '../lib/baked/math.js'
import DS from '../lib/baked/ds.js'
const libraries = [STD, MATH, DS, STR]
const programs = [
  `(import math "PI" "circumference") (Array (PI) (circumference 1))`,
  `(import ds "hash-set" "hash-index" "hash-set-add!" "hash-set-get" "hash-set?" "hash-set-remove!")
  (import math "euclidean-mod")
  (import std "map" "index-of" "find-index" "find" "array-in-bounds?")
  
  (defconstant hs (hash-set 10))
  (hash-set-add! hs "Anthony")
  (hash-set-add! hs 3)
  (hash-set-add! hs "Bob")
  (hash-set-remove! hs "Bob")
  (Array (hash-set? hs "Anthony"))`,
  `(import std "index-of" "find" "find-index" "map" "array-in-bounds?")
  (import ds "hash-index" "hash-table?" "hash-table-add!" "hash-table-get" "hash-table")
  (import math "min" "euclidean-mod")
  
  (defun fibonacci-memoized n memo (if (< n 2) n
    (if (hash-table? memo n) (hash-table-get memo n)
    (do
      (defconstant cache (+ (fibonacci-memoized (- n 1) memo) (fibonacci-memoized (- n 2) memo)))
      (hash-table-add! memo n cache)
      cache))))
  
  (Array (fibonacci-memoized 10 (hash-table 10)))`,
  `(import ds "hash-table" "hash-index" "hash-table-add!" "hash-table-get")
  (import math "euclidean-mod")
  (import std "map" "find-index" "find" "array-in-bounds?")
  (defconstant ht (hash-table 10))
  (hash-table-add! ht "name" "Anthony")
  (hash-table-add! ht "age" 33)
  (Array (hash-table-get ht "name"))`,
  `(import ds "binary-tree-node" "binary-tree-set-left!" "binary-tree-get-value"  "binary-tree-get-left")
  (defconstant tree (binary-tree-node 10))
  (go 
    tree 
    (binary-tree-set-left! (binary-tree-node 8)) 
    (binary-tree-get-left)
    (binary-tree-get-value)
    (Array))
  `,
  `(import str "to-upper-case" "to-lower-case") (Array (to-lower-case "Lisp is Cool AT-29") (to-upper-case "Lisp is Cool AT-29"))`,
  `(import std "map") (go (Array 1 2 4) (map (lambda x . . (* x 2))))`,
  `(import std "map")
  (import math "prime?" "sqrt" "abs" "square" "average")
  (go
    (Array 2 3 5 7 11 10 2563 1 48 1729)
    (map (lambda x . . (prime? x))))`,
  `(import std "push!" "concat" "quick-sort")
  (go
    (Array 3 0 5 3 2 4 1)
    (quick-sort))`,
  `(import math "round" "floor")
  (Array (round 1.5) (floor 1.5) (round 1.2) (floor 1.2) (round 1.7) (floor 1.7))`,
  `(import std "reverse")
  (reverse (Array 1 2 3 4 5))`,
  `(import math "greatest-common-divisor")
  (Array (greatest-common-divisor 12 8))`,
  `(import math "greatest-common-divisor" "adjacent-difference" "prime?" "sqrt" "abs" "square" "average")
  (import std "every?")
  (defun is-array-of-coprime-pairs inp (and
    (go inp (every? (lambda x . . (prime? x))))
    (go inp (adjacent-difference (lambda a b (greatest-common-divisor a b))) (cdr) (every? (lambda x . . (= x 1))))))
    (Array (is-array-of-coprime-pairs (Array 7 13 59 31 19)))`,
  `(import std "cartesian-product" "reduce" "map" "merge" "push!")
    (cartesian-product (Array "x" "y") (Array 1 2))`,
  `(import math "greatest-common-divisor" "least-common-divisor")
  (Array (greatest-common-divisor 8 36) (least-common-divisor 12 7))`,
  `(import math "arithmetic-progression" "range")
   (import std "push!")
    (Array (arithmetic-progression 5 25) (range 1 10))`,
  `(import std "reduce") (import str "join")
    (go (Array "Hello" "World") (join "-") (Array))`,
  `(import math "power" "factorial" "sqrt" "abs" "square" "average" "round")
    (Array (round (sqrt (power 2 (factorial 4)))))`,
  `(import math "levenshtein-distance" "minimum" "min")
    (import std "reduce")
  (Array (levenshtein-distance "duck" "dark"))`,
  ` (import math "round")
      (defun binomial-coefficient n k
        (or (cond
          (or (< k 0) (> k n)) 0
          (or (= k 0) (= k n)) 1
          (or (= k 1) (= k (- n 1))) n) (do
            (when (< (- n k) k) (setf k (- n k)))
            (loop defun iterate i res (if (<= i k) (iterate (+ i 1) (* res (- n i -1) (/ i))) res))
            (round (iterate 2 n)))))
        (Array (binomial-coefficient 8 2))`,
  `(import std "slice" "window" "push!" "reduce")
      (Array (window (Array 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16) 4))`,
  `(import math "max-bit" "min-bit" "clamp-bit")
      (Array (max-bit 1 2) (min-bit 1 2) (clamp-bit 100 2 50) (clamp-bit 10 0 20))`,
  `(import math "bit-power-of-two?"  "count-number-of-ones-bit")
    (import std "map")
    (Array (map (Array 2 4 8 16 32 64 1 3 7 40 49) (lambda x . . (bit-power-of-two? x))) (count-number-of-ones-bit 23))`,
  `(import math "possible-subsets-bit")
    (Array (possible-subsets-bit (Array "a" "b" "c")))`,
  `(import std "array-of-numbers" "map" "reduce")
(import math "maximum" "max")
(go (Array "1" "2" "3") (array-of-numbers) (maximum) (Array))`,
  `(import math "permutations") (Array (permutations (Array 1 2 3)))`,
  `(import std "equal?" "some?") (Array (equal? 1 1) (equal? 1 2) (equal? (Array 1) (Array 1)) (equal? (Array (Array 1 2)) (Array (Array 1 2))) (equal? (Array (Array 1 2)) (Array (Array 0 2))))`,

  `(import str "trim") (Array (trim "a a "))`,
  `(import std "empty!")
 (defconstant array (Array 1 2 3 4))
 (empty! array)
 (Array array)`,
  `(import std "clone")
 (defconstant arr (' (' 1 2 3) 2 (' 3 4 5)))
 (defconstant c (clone arr))
 (set (get c 0) 1 100)
 (Array arr c)
 `,
  `
(import std "empty?" "empty!")
(defvar arr (' 1 2 3 4))
(Array
   (empty? arr)
   (empty! arr)
   (empty? arr)) 
`,
  `(import math "summation" "reduce")
(defconstant add (function args (summation args)))
(Array (add 2 3 4))`,
  `(import std "zip" "scan" "take" "fold")
  (import math "even?")
  (go 
  (' 1 2 3 4 5 6 7 8 9 10) 
  (take even?) 
  (zip (' "A" "B" "C" "D" "E"))
  (scan (lambda x (concatenate (type (* (car x) 10) String) "-" (car (cdr x)))))
  (fold (lambda a x (concatenate x a)) "")
  (Array))`,
  `(import std "scan" "fold")
  (deftype pure-fn (Lambda (Or (Array (Number))) (Or (Array (Function))) (Or (Number))))
  (safety defun pure-fn arr std (do
  (destructuring-bind scan fold . std)
  (go 
    arr
    (scan (lambda x (* x 2)))
    (fold (lambda a b (+ a b)) 0))))
  (Array (pure-fn (' 1 2 3 4 5) (' scan fold)))`,

  `
  ; Input: n = 4
  ; Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
  ; Explanation: There exist two distinct solutions to the 4-queens puzzle as shown above
  ; Example 2:
  ; Input: n = 1
  ; Output: [["Q"]]
  (import std "for-n" "scan" "map" "reduce" "array-in-bounds?" "fill" "find" "find-index" "index-of")
  (import math "euclidean-mod")
  (import str "join")
  (import ds "hash-set" "hash-set-add!" "hash-set-remove!" "hash-set?" "hash-index")
  (deftype n-queen (Lambda (Or (Number)) (Or (Array (Array (String))))))
  (defun n-queen n
    (do 
    (defconstant solutions ())
    (defconstant cols (hash-set 10))
    (defconstant pos-diag (hash-set 10))
    (defconstant neg-diag (hash-set 10))
    (defconstant board (scan (Array n length) (lambda . (fill (Array n length) "."))))
    (defun backtrack row 
      (if (= row n) (set solutions (length solutions) (scan board (lambda a (join a "")))) (do 
        (for-n (- n 1) (lambda col 
          (unless 
            (or 
              (hash-set? cols col) 
              (hash-set? pos-diag (+ row col))
              (hash-set? neg-diag (- row col)))
            (do 
              (hash-set-add! cols col)
              (hash-set-add! pos-diag (+ row col))
              (hash-set-add! neg-diag (- row col))
              (set (get board row) col "Q")
  
              (backtrack (+ row 1)) 
  
              (hash-set-remove! cols col)
              (hash-set-remove! pos-diag (+ row col))
              (hash-set-remove! neg-diag (- row col))
              (set (get board row) col "."))))))))
    (backtrack 0)
    solutions))
  
  (Array
     (n-queen 1) 
     (n-queen 4))`,
]

describe('Libraries', () => {
  it('Should be correct', () =>
    deepStrictEqual(
      programs.map((source) => runFromInterpreted(source, libraries)),
      [
        [3.141592653589793, 6.283185307179586],
        [1],
        [55],
        ['Anthony'],
        [8],
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
        [3],
        [
          [
            [1, 2, 3],
            [2, 1, 3],
            [3, 1, 2],
            [2, 1, 3],
          ],
        ],
        [1, 0, 1, 1, 0],
        ['a a'],
        [[]],
        [
          [[1, 2, 3], 2, [3, 4, 5]],
          [[1, 100, 3], 2, [3, 4, 5]],
        ],
        [0, [], 1],
        [9],
        ['100-E80-D60-C40-B20-A'],
        [30],
        [
          [['Q']],
          [
            ['.Q..', '...Q', 'Q...', '..Q.'],
            ['..Q.', 'Q...', '...Q', '.Q..'],
          ],
        ],
      ]
    ))
  it('Should compile matching interpretation', () =>
    programs.forEach((source) =>
      deepStrictEqual(
        runFromCompiled(source, libraries),
        runFromInterpreted(source, libraries)
      )
    ))
})
