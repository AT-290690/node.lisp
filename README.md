# Node Lisper

<p align="center">
<img width="200" src="./logo.svg"/>
</p>

A Lisp for Node

```lisp
(let hello "Hello World")
(log (concatenate hello "!!!"))
```

```lisp
(function fibonacci n
  (if (< n 2)
      n
      (+ (fibonacci (- n 1))
         (fibonacci (- n 2)))))

(fibonacci 10)
; 55
```

```lisp
; Define reusable modules
(function binary-search
        array target (block
  (loop search
        arr target start end (block
    (if (<= start end) (block
        (let index (floor (* (+ start end) 0.5)))
        (let current (get arr index))
        (if (= target current) target
          (if (> current target)
            (search arr target start (- index 1))
            (search arr target (+ index 1) end)))))))
   (search array target 0 (length array))))
```

```lisp
(let is-odd (lambda x i o (= (mod x 2) 1)))
(let mult_2 (lambda x i o (* x 2)))
(let sum (lambda a x i o (+ a x)))
; Pipe the first to a series of composed functions
; (arg (arg .. ) (arg .. ) (ar . . . . ))
(do
  (Array 1 2 3 4 5 6 7 101)
  (remove is-odd)
  (map mult_2)
  (reduce sum 0))
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

<p align="center">
<img width="80" src="./lisp-lizard.svg"/>
</p>
