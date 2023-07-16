(import std "map" "reduce" "floor" "split-by-lines" "sum-array" "product-array")
(defvar sample 
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

(defvar *input* sample)
; (defvar *input* (open "./playground/src/aoc_2020/3/input.txt"))

(defun to_bit_array array 
  (map array (lambda line . . (trace line (type Array) (map (lambda x . . (= x "#")))))))

(defun *solve* array slopeX slopeY (do 
  (defvar 
    h (length array)
    w (length (car array)))
  (trace (* h (/ slopeY))
      (floor)
      (Array length)
      (map (lambda . index . 
        (trace array 
          (get (* index slopeY))
          (get (mod (* index slopeX) w))))))))

(defun task *input* (do 
  (defvar matrix (trace *input* 
              (split-by-lines)
              (to_bit_array)))
  ; 7 for sample
  (Array 
  (trace matrix
    (*solve* 3 1)
    (sum-array)) 
  ; 336 for sample
  (trace 
  (Array 
    (Array 1 1) 
    (Array 3 1) 
    (Array 5 1) 
    (Array 7 1) 
    (Array 1 2)) 
    (map (lambda x . . (trace matrix (*solve* (car x) (car (cdr x))) (sum-array))))
    (product-array)))))

(task *input*)