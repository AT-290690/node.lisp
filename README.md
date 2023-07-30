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
(defconstant is-odd (lambda x . . (= (mod x 2) 1)))
(defconstant mult_2 (lambda x . . (* x 2)))
(defconstant sum (lambda a x . . (+ a x)))
; Pipe the first to a series of composed functions
; (arg (arg .. ) (arg .. ) (ar . . . . ))
(go
  (Array 1 2 3 4 5 6 7 101)
  (remove is-odd)
  (map mult_2)
  (reduce sum 0))
```

```lisp
(import std "range" "push" "factorial" "product-array" "reduce")
(defun factorial n
  (go
    (range 1 n)
    (product-array)))
(factorial 10)
```

Simple CLI usage - create main.js

```js
import lisp from 'node-lisper'
lisp.cli()
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
-std              list std functions
-------------------------------------
-import           log import for std
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
-repl    start Read Eval Print Loop
-------------------------------------
```

Parse, Interpred & Compile

```js
import lisp from 'node-lisper'
lisp.parse('(+ 1 2)') // [[{  type: 'apply', value: '+' }, { type: 'atom', value: 1 }, { type: 'atom', value: 2 }]]
lisp.interpred('(+ 1 2)') // 3
lisp.compile('(+ 1 2)') // 3 but faster!
lisp.js(lisp.parse('(+ 1 2)')).program // (1 + 2); as js
```

Compiles to JavaScript

```lisp
(import std "remove" "map" "reduce")
(go
  (Array 1 2 3 4 5 6 7 101)
  (remove (lambda x . . (= (mod x 2) 1)))
  (map (lambda x . . (* x 2)))
  (reduce (lambda a x . . (+ a x)) 0))
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
