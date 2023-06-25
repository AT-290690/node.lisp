(import std "map" "reduce" "floor" "split-by-lines" "sum-array" "product-array")
(let sample 
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

(let *input* sample)
; (let *input* (open "./playground/src/aoc_2020/3/input.txt"))

(function to_bit_array array 
  (map array (lambda line _ _ (do line (type Array) (map (lambda x _ _ (= x "#")))))))

(function *solve* array slopeX slopeY (block 
  (let h (length array))
  (let w (length (car array)))
  (do (* h (/ slopeY))
      (floor)
      (Array length)
      (map (lambda _ index _ 
        (do array 
          (get (* index slopeY))
          (get (mod (* index slopeX) w))))))))

(function task *input* (block 
  (let matrix (do *input* 
              (split-by-lines)
              (to_bit_array)))
  ; 7 for sample
  (Array 
  (do matrix
    (*solve* 3 1)
    (sum-array)) 
  ; 336 for sample
  (do 
  (Array 
    (Array 1 1) 
    (Array 3 1) 
    (Array 5 1) 
    (Array 7 1) 
    (Array 1 2)) 
    (map (lambda x _ _ (do matrix (*solve* (car x) (car (cdr x))) (sum-array))))
    (product-array)))))

(task *input*)