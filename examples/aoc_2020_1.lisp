(import std "quick-sort" "binary-search" "floor" "push" "map" "reduce" "product-array" "concat" "array-of-numbers" "split-by-lines")

(defvar sample "1721
979
366
299
675
1456")

(defvar *input* sample)
; (defvar *input* (open "./playground/src/aoc_2020/1/input.txt"))

(defun *solve1* array cb 
     (reduce array (lambda a x . array (do
        (defvar res (binary-search array (cb x)))
        (if res (push a res) a))) 
     ()))

(defun *solve2* array cb 
    (reduce array
      (lambda accumulator y i array (do
          (loop defun iterate j bounds (do 
              (defvar x (get array j))
              (defvar res (binary-search array (cb x y)))
              (if res (push accumulator res))
            (if (< j bounds) (iterate (+ j 1) bounds)
        accumulator)))
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
