(function floor n (| n 0))
(function push array value (set array (length array) value))
(function array_to_numbers array (map array (lambda x i (type Number x))))
(function product_array array (reduce array (lambda a b i o (* a b)) 1))
(function split_by_lines string (format string (esc "n")))
(function string_to_array string delim 
                      (reduce (... string) 
                        (lambda a x i o (block
                                  (if (= x delim) (push a (Array 0)) (block 
                                    (push (get a -1) x) a))))(push (Array 0) (Array 0))))
(function join array delim (reduce array (lambda a x i o (concatenate a delim x)) ""))

(function concat array1 array2 (block
  (loop iterate i bounds (block
  (if (< i (length array2)) (push array1 (get array2 i)))
  (if (< i bounds) 
    (iterate (+ i 1) bounds)
  array1)))
(iterate 0 (- (length array2) 1))))

(function map array callback (block 
  (let new_array (Array 0))
  (let i 0)
  (loop iterate i bounds (block
    (set new_array i (callback (get array i) i))
    (if (< i bounds) (iterate (+ i 1) bounds) new_array)))
  (iterate 0 (- (length array) 1))))

(function reduce array callback initial (block
  (loop iterate i bounds (block
    (let* initial (callback initial (get array i) i array))
    (if (< i bounds) (iterate (+ i 1) bounds) initial)))
  (iterate 0 (- (length array) 1))))

(function quick_sort arr (block
  (if (<= (length arr) 1) arr
  (block
    (let pivot (get arr 0))
    (let left_arr (Array 0))
    (let right_arr (Array 0))
(loop iterate i bounds (block
    (let current (get arr i))
    (if (< current pivot) 
        (push left_arr current)
        (push right_arr current))
    (if (< i bounds) (iterate (+ i 1) bounds))))
    (iterate 1 (- (length arr) 1))
(do 
  left_arr (quick_sort) 
  (push pivot) 
  (concat (quick_sort right_arr)))))))

(function binary_search 
        array target (block
  (loop search 
        arr target start end (block
    (if (<= start end) (block 
        (let index (floor (* (+ start end) 0.5)))
        (let current (get arr index))
        (if (= target current) target
          (if (> current target) 
            (search arr target start (- index 1))
            (search arr target (+ index 1) end))))))) 
   (search array target 0 (length array))))

(let sample "1721
979
366
299
675
1456")

(let input sample)

(function solve1 array cb 
     (reduce array (lambda a x i array (block
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
