(import std "map" "reduce" "floor" "split_by_lines" "sum_array" "product_array")
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

(let input sample)
(let input (open "./playground/src/aoc_2020/3/input.txt"))

(function to_bit_array array 
  (map array (lambda line _ _ (do line (...) (map (lambda x _ _ (= x "#")))))))

(function solve array slopeX slopeY (block 
  (let h (length array))
  (let w (length (get array 0)))
  (do (* h (/ slopeY))
      (floor)
      (Array length)
      (map (lambda _ index _ 
        (do array 
          (get (mod (* index slopeY) h)) 
          (get (mod (* index slopeX) w)))))
      (sum_array))))

(function task input (block 
(let matrix (do input 
            (split_by_lines)
            (to_bit_array)))
; 7 for sample
(do matrix
  (solve 3 1) 
  (log)) 
; 336 for sample
(do 
(Array 
  (Array 1 1) 
  (Array 3 1) 
  (Array 5 1) 
  (Array 7 1) 
  (Array 1 2)) 
  (map (lambda x _ _ (solve matrix (get x 0) (get x 1))))
  (product_array)
  (log))))

(task input)