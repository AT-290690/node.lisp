(import std "quick_sort" "binary_search" "floor" "push" "map" "join" "reduce" "product_array" "concat" "array_to_numbers" "split_by_lines")

(let sample "1721
979
366
299
675
1456")

; (let input (open "./playground/src/aoc_2020/1/input.txt"))
(let input sample)

(function solve1 array cb 
     (reduce array (lambda a x _ array (block
        (let res (binary_search array (cb x)))
        (if res (push a res) a))) 
     (Array 0)))

; 514579 for sample
(do input
  (split_by_lines)
  (array_to_numbers)
  (quick_sort)
  (solve1 (lambda x (- 2020 x)))
  (product_array)
  (log))

(function solve2 array cb 
    (reduce array
      (lambda accumulator y i array (block
          (loop iterate j bounds (block 
              (let x (get array j))
              (let res (binary_search array (cb x y)))
              (if res (push accumulator res))
            (if (< j bounds) (iterate (+ j 1) bounds)
        accumulator)))
        (iterate i (- (length array) 1)))) 
     (Array 0)))

; 241861950 for sample
(do input
  (split_by_lines)
  (array_to_numbers)
  (quick_sort)
  (solve2 (lambda x y (- 2020 x y)))
  (product_array)
  (log))
