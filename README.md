# wisp

Lisp for web

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
;; Define reusable modules
(function binary_search
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
(let is_odd (lambda x i (= (mod x 2) 1)))
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
