# Node Lisper

<p align="center">
<img width="200" src="./logo.svg"/>
</p>

A Lisp for Node

```lisp
(defvar hello "Hello World")
(log (concatenate hello "!!!"))
```

```lisp
(defun fibonacci n
  (if (< n 2)
      n
      (+ (fibonacci (- n 1))
         (fibonacci (- n 2)))))

(fibonacci 10)
; 55
```

```lisp
; Define reusable modules
(defun binary-search
        array target (block
  (loop search
        arr target start end (block
    (if (<= start end) (block
        (defvar index (floor (* (+ start end) 0.5)))
        (defvar current (get arr index))
        (if (= target current) target
          (if (> current target)
            (search arr target start (- index 1))
            (search arr target (+ index 1) end)))))))
   (search array target 0 (length array))))
```

```lisp
(defvar is-odd (lambda x i o (= (mod x 2) 1)))
(defvar mult_2 (lambda x i o (* x 2)))
(defvar sum (lambda a x i o (+ a x)))
; Pipe the first to a series of composed functions
; (arg (arg .. ) (arg .. ) (ar . . . . ))
(do
  (Array 1 2 3 4 5 6 7 101)
  (remove is-odd)
  (map mult_2)
  (reduce sum 0))
```

```lisp
(import std "range" "push" "factorial" "product-array" "reduce")
(defun factorial n
  (do
    (range 1 n)
    (product-array)))
(factorial 10)
```

Simple CLI usage - create main.js

```js
import lisp from './node-lisper'
lisp.cli()
```

```json
"scripts": {
  "lisp": "node main.js"
}
```

interpred

```
yarn lisp -file <filepath> -r
```

or compile

```
yarn lisp -s <filepath lisp> -d <filepath js> -c
```

show help

```
yarn lisp -help
```

```
-------------------------------------
-help
-------------------------------------
-std             list std functions
-------------------------------------
-import          log import for std
-------------------------------------
-s                   prepare a file
-------------------------------------
-d               file to compile js
-------------------------------------
-c                    compile to js
-------------------------------------
-r                  interpret & run
-------------------------------------
-p      interpret & run with 0 deps
-------------------------------------
-repl    start Read Eval Print Loop
-------------------------------------
```

Parse, Interpred & Compile

```js
import lisp from './node-lisper'
lisp.parse('(+ 1 2)') // [[{  type: 'apply', value: '+' }, { type: 'atom', value: 1 }, { type: 'atom', value: 2 }]]
lisp.interpred('(+ 1 2)') // 3
lisp.compile('(+ 1 2)') // 3 but faster!
lisp.js(lisp.parse('(+ 1 2)')).program // (1 + 2); as js
```

Compiles to JavaScript

```lisp
(import std "remove" "map" "reduce")
(do
  (Array 1 2 3 4 5 6 7 101)
  (remove (lambda x _ _ (= (mod x 2) 1)))
  (map (lambda x _ _ (* x 2)))
  (reduce (lambda a x _ _ (+ a x)) 0))
```

```js
reduce(
  map(
    remove([1, 2, 3, 4, 5, 6, 7, 101], (x, _1, _2) => {
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
(loop sum-below number sum (block
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

<p align="center">
<img width="80" src="./lisp-lizard.svg"/>
</p>
