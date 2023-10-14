(import ds "hash-index" 
  "hash-table-add!" "hash-table?" "hash-table-get" "hash-table" "hash-table-make")
(import std 
"array-in-bounds?" "find-index"
  "reduce" "push!" "select" "deep-flat" "for-each"
  "every?" "array-of-numbers" "map"
  "some?" "find" "slice" "concat" "for-n")
(import math "odd?" "euclidean-mod" "min" "power" "summation" "min" "count-number-of-ones-bit")
(import str "split-by-lines" "join" "split-by" "trim" )
(defconstant *input* 
(Array 
"mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0"
"mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1"))
(deftype Int (Lambda (Or (String) (Number) (Integer)) (Or (Integer))))
(defun Int n (type n Integer))
; for debug use only
(defun int-to-bit int (go int (type Number) (Bit)))
(deftype summation-ints (Lambda (Or (Array (Integer))) (Or (Integer))))
(defun summation-ints ints (reduce ints (lambda a b . . (+ a b)) (Int 0)))
(deftype to-mask-of (Lambda (Or (Array (String))) (Or (String)) (Or (Integer))))
(defun to-mask-of arr t (go arr (reduce (lambda acc x . . (if (= x t) (go acc (<< (Int 1)) (| (Int 1))) (go acc (<< (Int 1))))) (Int 0))))
(deftype parse (Lambda (Or (String)) (Or (Array (Array (String) (String))))))
(defun parse input (go input (split-by-lines) (map (lambda x . . (split-by x " = ")))))
(deftype parse-input (Lambda (Or (String)) (Or (Array (Array (Array (Integer) (Integer)) (Array (Number) (String)) (Array (Number) (String)) (Array (Number) (String)))))))
(defun parse-input-1 input (go 
      input 
      (parse)
      (reduce (lambda a b . . (do
        (if (= (car b) "mask") (do
          (defconstant mask (go (car (cdr b)) (type Array)))
          (push! a (Array (Array (to-mask-of mask "X") (to-mask-of mask "1")))))
          (push! (get a -1) 
                (Array (go b
                  (car)
                  (regex-match "[0-9]")
                  (join "")
                  (type Number))
                  (car (cdr b))))) a)) (Array))))
(deftype part1 (Lambda (Or (String)) (Or (Integer))))
(defun part1 input (do 
    (go input 
      (parse-input-1)
      (reduce (lambda memory fields . .
        (reduce (cdr fields) (lambda memory x . .
            (hash-table-add! memory
              (car x)
              (go
                x
                (cdr)
                (car)
                (Int)
                (& (go fields (car) (car) (Int)))
                (| (go fields (car) (cdr) (car) (Int))))))
              memory))
        (hash-table 10))
    (deep-flat)
    (select (lambda . i . (odd? i)))
    (summation-ints))))
(deftype quantum-mask (Lambda (Or (Integer)) (Or (Integer)) (Or (Integer))))
(defun quantum-mask mask-x x (do
  (defvar rev-result (Int 0))
  (loop defun iter-and i (when (< i 36) 
    (do 
      (setf rev-result (<< rev-result (Int 1)))
      (when (= (& mask-x (Int 1)) (Int 1)) (do 
        (setf rev-result (| rev-result (& x (Int 1))))
        (setf x (>> x (Int 1)))))
      (setf mask-x (>> mask-x (Int 1)))
      (iter-and (+ i 1)))))
  (iter-and 0)

  (defvar result (Int 0))
   (loop defun iter-or i (if (< i 36) 
    (do 
      (setf result (| (<< result (Int 1)) (& rev-result (Int 1))))
      (setf rev-result (>> rev-result (Int 1)))
      (iter-or (+ i 1)))))
  (iter-or 0)
  result))
(deftype part2 (Lambda (Or (String)) (Or (Integer))))
(defun part2 input (do 
    (defvar n 0)
    (go input 
      (parse)
      (reduce (lambda a b . . (do
        (if (= (car b) "mask") (do
          (defconstant 
                mask (go (car (cdr b)) (type Array))
                mask-x (to-mask-of mask "X")
                mask-1 (to-mask-of mask "1"))
          (setf n (<< 2 (count-number-of-ones-bit (type mask-x Number))))
          (push! a (Array (Array mask-x mask-1))))
          (push! (get a -1) 
                (Array (go b
                  (car)
                  (regex-match "[0-9]")
                  (join "")
                  (type Number))
                  (car (cdr b))))) a)) (Array))
      (reduce (lambda memory fields . .
        (reduce (cdr fields) (lambda memory x . . (do
        (defconstant 
              mask-1 (go fields (car) (cdr) (car) (Int))
              mask-x (go fields (car) (car) (Int))
              addr (& (| (Int (car x)) mask-1) (~ mask-x))
              value (go x (cdr) (car) (Int)))
        (for-n n (lambda i (hash-table-add! memory (type (| addr (quantum-mask mask-x (Int i))) Number) value))) 
        memory)) memory))
        (hash-table 10))
    (deep-flat)
    (select (lambda . i . (odd? i)))
    (summation-ints))))

(Array 
  (part1 (car *input*))
  (part2 (car (cdr *input*))))

; 0 -> 0
; 1 -> 1
; 1 -> 0
