(import std "map" "reduce" "split-by-lines")
(import math "floor" "sum-array" "product-array")
(defconstant sample 
"..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#")
; (deftype matrix-t (Array (Array (Number))))
; (deftype input-t (String))
(defconstant *input* sample)
; (defvar *input* (:open "./playground/src/aoc_2020/3/input.txt"))
(deftype to_bit_array (Lambda (Or (Array (String))) (Or (Array (Array (Number))))))
(defun to_bit_array array 
  (map array (lambda line . . (go line (type Array) (map (lambda x . . (= x "#")))))))

(deftype *solve* (Lambda (Or (Array (Array (Number)))) (Or (Number)) (Or (Number)) (Or (Array (Number)))))
(defun *solve* array slopeX slopeY (do 
  (defconstant 
    h (length array)
    w (length (car array)))
  (go (* h (/ slopeY))
      (floor)
      (Array length)
      (map (lambda . index . 
        (go array 
          (get (* index slopeY))
          (get (mod (* index slopeX) w))))))))

(deftype task (Lambda (Or (String)) (Or (Array (Number)))))
(defun task *input* (do 
  (defconstant matrix (go *input* 
              (split-by-lines)
              (to_bit_array)))
  ; 7 for sample
  (Array 
  (go matrix
    (*solve* 3 1)
    (sum-array)) 
  ; 336 for sample
  (go 
  (Array 
    (Array 1 1) 
    (Array 3 1) 
    (Array 5 1) 
    (Array 7 1) 
    (Array 1 2)) 
    (map (lambda x . . (go matrix (*solve* (car x) (car (cdr x))) (sum-array))))
    (product-array)))))

(task *input*)