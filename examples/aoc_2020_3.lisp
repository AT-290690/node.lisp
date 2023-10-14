(import std "map" "reduce")
(import str "split-by-lines")
(import math "floor" "summation" "product")
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
  (map array (lambda line . . (go line (type Array) (map (safety lambda x . . (= x "#")))))))

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
    (summation)) 
  ; 336 for sample
  (go 
  (' 
    (' 1 1) 
    (' 3 1) 
    (' 5 1) 
    (' 7 1) 
    (' 1 2)) 
    (map (lambda x . . (go matrix (*solve* (car x) (car (cdr x))) (summation))))
    (product)))))

(task *input*)