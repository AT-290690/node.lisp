;; max
(function max a b (if (> a b) a b))
;; min
(function min a b (if (< a b) a b))
;; is_odd
(function is_odd x i (eq (mod x 2) 1))
;; is_even
(function is_even x i (eq (mod x 2) 0))
;; sum
(function sum a x i (+ a x))
;; push
(function push array value (set array (length array) value))
;; euclidean_mod
(function euclidean_mod a b (mod (+ (mod a b) b) b))
;; concat
(function concat array1 array2 (block
  (loop iterate i bounds (block
  (push array1 (get array2 i))
  (if (< i bounds) 
    (iterate (+ i 1) bounds)
  array1
  )))
(iterate 0 (- (length array2) 1))))
;; merge
(function merge array1 array2 (block
  (loop iterate i bounds (block
  (push array1 (get array2 i))
  (if (< i bounds) 
    (iterate (+ i 1) bounds)
  array1
  )))
(iterate 0 (- (length array2) 1))))
;; range
(function range start end (block
  (:= array (Array 0))
  (loop iterate i bounds (block
    (push array (+ i start))
    (if (< i bounds) (iterate (+ i 1) bounds) array)))
  (iterate 0 (- end start))))
;; map
(function map array callback (block 
  (:= new_array (Array 0))
  (:= i 0)
  (loop iterate i bounds (block
    (set new_array i (callback (get array i) i))
    (if (< i bounds) (iterate (+ i 1) bounds) new_array)))
  (iterate 0 (- (length array) 1))))
;; for_each
(function for_each array callback (block
  (loop iterate i bounds (block
    (callback (get array i) i)
    (if (< i bounds) (iterate (+ i 1) bounds) array)))
  (iterate 0 (- (length array) 1))))
;; filter
(function filter array callback (block
  (:= new_array (Array 0))
  (:= i 0)
  (loop iterate i bounds (block
    (:= current (get array i))
    (if (callback current i) 
      (push new_array current))
    (if (< i bounds) (iterate (+ i 1) bounds) new_array)))
  (iterate 0 (- (length array) 1))))
;; reduce
(function reduce array callback initial (block
  (loop iterate i bounds (block
    (= initial (callback initial (get array i) i))
    (if (< i bounds) (iterate (+ i 1) bounds) initial)))
  (iterate 0 (- (length array) 1))))
;; deep_flat
(function deep_flat arr (block 
  (:= new_array (Array 0)) 
  (loop flatten item (if (Arrayp item) (for_each item (lambda x _ (flatten x))) 
  (push new_array item)))
  (flatten arr) 
  new_array
))
;; find
(function find array callback (block
  (loop iterate i bounds (block
    (:= current (get array i))
    (if (and (not (callback current i)) (< i bounds))
      (iterate (+ i 1) bounds) 
      current)))
      (iterate 0 (- (length array) 1))))
;; std of wisp