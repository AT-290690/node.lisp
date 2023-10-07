(import std "quick-sort" "binary-search" "map" "reduce" "concat" "array-of-numbers" "split-by-lines")
(import math "floor" "product")
(defconstant sample "1721
979
366
299
675
1456")
(defconstant *input* sample)
; (defvar *input* (:open "./playground/src/aoc_2020/1/input.txt"))
(deftype *solve1* (Lambda (Or (Array (Number))) (Or (Function)) (Or (Array (Number)))))
(defun *solve1* array cb 
     (reduce array (lambda a x . array (do
        (defvar res (binary-search array (cb x)))
        (if res (set a (length a) res) a))) 
     (Array)))

(deftype *solve2* (Lambda (Or (Array (Number))) (Or (Function)) (Or (Array (Number)))))
(defun *solve2* array cb 
    (reduce array
      (lambda accumulator y i array (do
          (loop defun iterate j bounds (do 
              (defvar x (get array j))
              (defvar res (binary-search array (cb x y)))
              (when res (set accumulator (length accumulator) res))
            (if (< j bounds) (iterate (+ j 1) bounds) accumulator)))
        (iterate i (- (length array) 1)))) 
     (Array)))

(Array 
; 514579 for sample
(go *input*
  (split-by-lines)
  (array-of-numbers)
  (quick-sort)
  (*solve1* (safety lambda x (- 2020 x)))
  (product))

; 241861950 for sample
(go *input*
  (split-by-lines)
  (array-of-numbers)
  (quick-sort)
  (*solve2* (safety lambda x y (- 2020 x y)))
  (product)))
