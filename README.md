# Node Lisper

<p align="center">
<img width="150" src="./logo.svg"/>
</p>

A Lisp for Node

```lisp
(defvar hello "Hello World")
(log (concatenate hello "!!!"))
```

```lisp
; naive exponential time complexity
(defun fibonacci n
  (if (< n 2)
      n
      (+ (fibonacci (- n 1))
         (fibonacci (- n 2)))))

(fibonacci 10) ; 55

; to use memo (hashmap) you need to import ALL of these functions
(import std "index-of" "find" "find-index" "map" "array-in-bounds?")
(import ds "hash-index" "hash-table?" "hash-table-add" "hash-table-get" "hash-table")
(import math "min" "euclidean-mod")

(defun fibonacci-memoized n memo (if (< n 2) n
  (if (hash-table? memo n) (hash-table-get memo n)
  (do
    (defconstant cache (+ (fibonacci-memoized (- n 1) memo) (fibonacci-memoized (- n 2) memo)))
    (hash-table-add memo n cache)
    cache))))

(fibonacci-memoized 10 (hash-table 10)) ; 55
```

```lisp
; Define reusable functions
(defun binary-search
        array target (do
  (loop defun search
        arr target start end (do
    (when (<= start end) (do
        (defvar index (floor (* (+ start end) 0.5)))
        (defvar current (get arr index))
        (if (= target current) target
          (if (> current target)
            (search arr target start (- index 1))
            (search arr target (+ index 1) end)))))))
   (search array target 0 (length array))))
```

```lisp
(defconstant odd? (lambda x . . (= (mod x 2) 1)))
(defconstant mult_2 (lambda x . . (* x 2)))
(defconstant sum (lambda a x . . (+ a x)))
; Pipe the first to a series of composed functions
; (arg (arg .. ) (arg .. ) (ar . . . . ))
(go
  (Array 1 2 3 4 5 6 7 101)
  (except odd?)
  (map mult_2)
  (reduce sum 0))
```

```lisp
(import std "push""reduce")
(import math "range" "product")
(defun factorial n
  (go
    (range 1 n)
    (product)))
(factorial 10)
```

```lisp
; https://leetcode.com/problems/maximum-count-of-positive-integer-and-negative-integer/
; yarn lisp -s /leetcode.lisp -d ./leetcode.js -c
(import std "count-of" "reduce")
(import math "max")
(deftype maximum-count (Lambda (Or (Array (Number))) (Or (Number))))
(defun maximum-count nums
    (max
      (count-of nums (lambda e . . (< e 0)))
      (count-of nums (lambda e . . (> e 0)))))
```

Simple CLI usage - create main.js

```js
import cli from 'node-lisper/cli'
cli()
```

```json
"type": "module",
"scripts": {
  "lisp": "node index.js"
}
```

interpred

yarn

```
yarn lisp -file <filepath> -r
```

npm

```
npm run lisp -- -file <filepath> -r
```

or compile

yarn

```
yarn lisp -s <filepath lisp> -d <filepath js> -c
```

npm

```
npm run lisp -- -s <filepath lisp> -d <filepath js> -c
```

show help

yarn

```
yarn lisp -help
```

npm

```
npm run lisp -- -help
```

```
-------------------------------------
-help
-------------------------------------
-lib                      target lib
-------------------------------------
-doc              list lib functions
-------------------------------------
-import           log import for lib
-------------------------------------
-s                    prepare a file
-------------------------------------
-d               file to compile js
-------------------------------------
-c                    compile to js
-------------------------------------
-r                  interpret & run
-------------------------------------
-p      interpret & run with 0 deps
-------------------------------------
-m                      minify code
-------------------------------------
-repl    start Read Eval Print Loop
-------------------------------------
```

Search available functions in libraries

```
yarn lisp -lib ds -doc binary
```

Parse, Interpred & Compile

```js
import lisp from 'node-lisper'
lisp.parse('(+ 1 2)') // [[{  t: 'f', v: '+' }, { t: 'a', v: 1 }, { t: 'a', v: 2 }]]
lisp.interpred('(+ 1 2)') // 3
lisp.compile('(+ 1 2)') // 3 but faster!
lisp.js(lisp.parse('(+ 1 2)')).program // (1 + 2); as js
```

Compiles to JavaScript

```lisp
(import std "except" "map" "reduce")
(go
  (Array 1 2 3 4 5 6 7 101)
  (except (lambda x . . (= (mod x 2) 1)))
  (map (lambda x . . (* x 2)))
  (reduce (lambda a x . . (+ a x)) 0))
```

```js
reduce(
  map(
    except([1, 2, 3, 4, 5, 6, 7, 101], (x, _1, _2) => {
      return +(x % 2 === 1)
    }),
    (x, _1, _2) => {
      return x * 2
    }
  ),
  (a, x, _2, _3) => {
    return a + x
  },
  0
)
```

```lisp
; Tail Call Optimization
(loop defun sum-below number sum (do
(if (= number 0) sum (sum-below (- number 1) (+ sum number)))))
(log (sum-below 10000 0))
```

```js
var log = (msg) => { console.log(msg) return msg },
    tco = (fn) => (...args) => {
      let result = fn(...args)
      while (typeof result === 'function') result = result()
      return result
    }
var sumBelow, rec_32721849989891052
;(sumBelow = tco(
  (rec_32721849989891052 = (number, sum) => {
    return +(number === 0)
      ? sum
      : () => rec_32721849989891052(number - 1, sum + number)
  }),
  rec_32721849989891052
)),
  sumBelow
log(sumBelow(10000, 0))
```

Types validated by interpretation

```lisp
(deftype find-bag (Lambda
                  ; ((("golden" "yellow") ((0 "dark" "blue") (2 "silver" "gray") ... )) ... )
                  (Or (Array (Array (Array (String) (String)) (Array (Array (Number) (String) (String))))))
                  (Or (String)) ; "golden"
                  (Or (String)) ; "yellow"
                  (Or
                    ; ((0 "dark" "blue") (2 "silver" "gray") ... )
                    (Array (Array (String) (String)) (Array (Array (Number) (String) (String))))
                    ; 0 - couldn't find
                    (Number))))
(defun find-bag bags left right
          (find bags
            (lambda x . . (and
              (= (car (car x)) left)
              (= (car (cdr (car x))) right)))))
```
