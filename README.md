# wisp

Lisp for web

```lisp
(let hello "Hello World")
(log (++ hello "!!!"))
```

```lisp
;; Define reusable modules
(function sort arr (block
  (if (<= (length arr) 1) arr
  (block
    (let pivot (get arr 0))
    (let left_arr (Array 0))
    (let right_arr (Array 0))
(loop iterate i bounds (block
    (let current (get arr i))
    (if (< current pivot)
        (push left_arr current)
        (push right_arr current))
    (if (< i bounds) (iterate (+ i 1) bounds))))
    (iterate 1 (- (length arr) 1))
(do
  left_arr (sort)
  (push pivot)
  (concat (sort right_arr)))))))
```

```lisp
(let is_odd (lambda x i (eq (mod x 2) 1)))
(let mult_2 (lambda x i (* x 2)))
(let sum (lambda a x i (+ a x)))
;; Pipe the first to a series of composed functions
;; (arg (arg .. ) (arg .. ) (ar . . . . ))
(do
  (Array 1 2 3 4 5 6 7 101)
  (filter is_odd)
  (map mult_2)
  (reduce sum 0))
```

interpred

```
yarn wisp -file <filepath> -run
```

or compile

```
yarn wisp -file <filepath> -js
```

write to file

```
yarn wisp -s <filepath lisp> -d <filepath js> -compile
```

show help

```
yarn wisp -help
```

```
 -------------------------------------
   -help
  -------------------------------------
   -file                prepare a file
  -------------------------------------
   -dep           include dependencies
  -------------------------------------
   -js           log javascript output
  -------------------------------------
   -compile              compile to js
  -------------------------------------
   -dist            file to compile js
  -------------------------------------
   -run              interpret and run
  -------------------------------------
   -log              interpret and log
  -------------------------------------
```
