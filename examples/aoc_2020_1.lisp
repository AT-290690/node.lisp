(import std "quick-sort" "push" "binary-search" "map" "reduce" "concat" "array-of-numbers" "split-by-lines")
(import math "floor" "product-array")
(defconstant sample "1721
979
366
299
675
1456")
(deftype numbers-t (Array (Number)))
(defconstant *input* sample)
; (defvar *input* (:open "./playground/src/aoc_2020/1/input.txt"))

(defun *solve1* array cb 
     (reduce (check-type array numbers-t) (lambda a x . array (do
        (defvar res (binary-search array (cb x)))
        (if res (set a (length a) res) a))) 
     ()))

(defun *solve2* array cb 
    (reduce (check-type array numbers-t)
      (lambda accumulator y i array (do
          (loop defun iterate j bounds (do 
              (defvar x (get array j))
              (defvar res (binary-search array (cb x y)))
              (when res (set accumulator (length accumulator) res))
            (if (< j bounds) (iterate (+ j 1) bounds) accumulator)))
        (iterate i (- (length array) 1)))) 
     ()))

(Array 
; 514579 for sample
(go *input*
  (split-by-lines)
  (array-of-numbers)
  (quick-sort)
  (*solve1* (lambda x (- 2020 x)))
  (product-array))

; 241861950 for sample
(go *input*
  (split-by-lines)
  (array-of-numbers)
  (quick-sort)
  (*solve2* (lambda x y (- 2020 x y)))
  (product-array)))
