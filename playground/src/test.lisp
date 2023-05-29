(function array_to_numbers array (map array (lambda x i (` (x)))))
;; (let sample (open "./playground/src/input.txt"))
(let sample "1721
979
366
299
675
1456")


(function binary_search 
        array target (block
  (loop search 
        arr target start end (block
    (if (<= start end) (block 
        (let index (floor (* (+ start end) 0.5)))
        (let current (get arr index))
        (if (eq target current) target
          (if (> current target) 
            (search arr target start (- index 1))
            (search arr target (+ index 1) end))))))) 
   (search array target 0 (length array))))

(function product_array array (reduce array (lambda a b i o (* a b)) 1))

(function solve1 array cb 
     (reduce array (lambda a x i array (block
        (let res (binary_search array (cb x)))
        (if res (push a res) a))) 
     (Array 0)))

; 514579
(do sample
  (split_by_lines)
  (array_to_numbers)
  (quick_sort)
  (solve1 (lambda x (- 2020 x)))
  (product_array)
  (log))

(function solve2 array cb 
    (reduce array
      (lambda accumulator y i array 
        (block
          (loop iterate j bounds (block 
              (let x (get array j))
              (let res (binary_search array (cb x y)))
              (if res (push accumulator res))
            (if (< j bounds) (iterate (+ j 1) bounds)
        accumulator)))
        (iterate i (- (length array) 1)))) 
     (Array 0)))

; 241861950
(do sample
  (split_by_lines)
  (array_to_numbers)
  (quick_sort)
  (solve2 (lambda x y (- 2020 x y)))
  (product_array)
  (log))
