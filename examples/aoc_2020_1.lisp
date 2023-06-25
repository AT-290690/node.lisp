(import std "quick-sort" "binary-search" "floor" "push" "map" "join" "reduce" "product-array" "concat" "array-of-numbers" "split-by-lines")

(let sample "1721
979
366
299
675
1456")

(let *input* sample)
; (let *input* (open "./playground/src/aoc_2020/1/input.txt"))

(function *solve1* array cb 
     (reduce array (lambda a x _ array (block
        (let res (binary-search array (cb x)))
        (if res (push a res) a))) 
     (Array 0 length)))

(function *solve2* array cb 
    (reduce array
      (lambda accumulator y i array (block
          (loop iterate j bounds (block 
              (let x (get array j))
              (let res (binary-search array (cb x y)))
              (if res (push accumulator res))
            (if (< j bounds) (iterate (+ j 1) bounds)
        accumulator)))
        (iterate i (- (length array) 1)))) 
     (Array 0 length)))

(Array 
; 514579 for sample
(do *input*
  (split-by-lines)
  (array-of-numbers)
  (quick-sort)
  (*solve1* (lambda x (- 2020 x)))
  (product-array))

; 241861950 for sample
(do *input*
  (split-by-lines)
  (array-of-numbers)
  (quick-sort)
  (*solve2* (lambda x y (- 2020 x y)))
  (product-array)))
