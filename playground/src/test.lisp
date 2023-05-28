(function push array value (set array (length array) value))
(function concat array1 array2 (block
(loop iterate i bounds (block
(if (< i (length array2)) (push array1 (get array2 i)))
(if (< i bounds) 
  (iterate (+ i 1) bounds)
array1
)))
(iterate 0 (- (length array2) 1))))

(function sort arr (block
(if (<= (length arr) 1) arr
(block
  (:= pivot (get arr 0))
  (:= left_arr (Array 0))
  (:= right_arr (Array 0))
(loop iterate i bounds (block
  (:= current (get arr i))
  (if (< current pivot) 
      (push left_arr current)
      (push right_arr current))
  (if (< i bounds) (iterate (+ i 1) bounds))))
  (iterate 1 (- (length arr) 1))
(if (and (length left_arr) (length right_arr)))
(:= left (sort left_arr))
(:= right (sort right_arr))
(concat (push left pivot) right)))))

(function reverse array (block
(:= len (length array))
(:= reversed (Array len))
(:= offset (- len 1))
(loop iterate i bounds (block
  (set reversed (- offset i) (get array i))
  (if (< i bounds) (iterate (+ i 1) bounds) reversed)))
(iterate 0 offset)))

(do
  (' 1 0 8 -2 3)
  (sort)
  (reverse) (log))