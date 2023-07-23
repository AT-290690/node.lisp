(import std 
"remove" "deep-flat" "is-odd" "for-each"
"hash-index" "euclidean-mod" "array-in-bounds-p" "find-index"
"hash-table-set" "hash-table-has" "hash-table-get" "hash-table" "hash-table-make"
"split-by-lines" "join" "split-by" "every" "trim" "range" "min" "max" "map" "array-of-numbers" "push" "reduce" "sum-array" "some" "find" "slice" "power" "sum-array")

(defvar sample "mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0")

(defvar *input* sample)
(defun to-mask-of arr t (go arr (reduce (lambda acc x . . (if (= x t) (go acc (<< (type 1 Integer)) (| (type 1 Integer))) (go acc (<< (type 1 Integer)) (| (type 0 Integer))))) (type 0 Integer))))
(Array 
  (go *input* (split-by-lines)
    (map (lambda x . . (split-by x " = ")))
    (reduce (lambda a b . . (do
      (if (= (car b) "mask") (do
        (defvar mask (go (car (cdr b)) (type Array)))
        (push a (Array (Array (to-mask-of mask "X") (to-mask-of mask "1")))))
        (push (get a -1) 
              (Array (go b
                (car)
                (regex-match "[0-9]")
                (join "")
                (type Number))
                (car (cdr b))))) a)) ())
    (reduce (lambda memory fields . .
      (reduce (cdr fields) (lambda memory x . .
          (hash-table-set memory
            (car x)
            (go
              x
              (cdr)
              (car)
              (type Integer)
              (& (go fields (car) (car) (type Integer)))
              (| (go fields (car) (cdr) (car) (type Integer))))))
            memory))
      (hash-table 10))
  (deep-flat)
  (remove (lambda . i . (= (mod i 2) 1)))
  (reduce (lambda a b . . (+ a b)) (type 0 Integer))))