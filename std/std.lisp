;; max
(function max a b (if (> a b) a b))
;; min
(function min a b (if (< a b) a b))
;; is_odd
(function is_odd x i (eq (mod x 2) 1))
;; is_even
(function is_even x i (eq (mod x 2) 0))
;; push
(function push array value (set array (length array) value))
;; abs
(function abs n (- (^ n (>> n 31)) (>> n 31)))
;; floor
(function floor n (| n 0))
;; round a number
(function round n (& (+ n 1) -2))
;; euclidean_mod
(function euclidean_mod a b (mod (+ (mod a b) b) b))
;; euclidean_div
(function euclidean_div a b (block 
                    (let q (* a (/ b)))
                    (if (< (mod a b) 0) (if (> b 0) (- q 1) (+ q 1)) q)))
;; join
(function join array delim (reduce array (lambda a x i o (++ a delim x)) ""))
;; string_to_array
(function string_to_array string delim 
                      (reduce (... string) 
                        (lambda a x i o (block
                                  (if (eq x delim) (push a (Array 0)) (block 
                                    (push (get a -1) x) a))))(push (Array 0) (Array 0))))
;; split_by_lines
(function split_by_lines string (map (string_to_array string (esc "n")) (lambda x i (join x ""))))
;; concat
(function concat array1 array2 (block
  (loop iterate i bounds (block
  (if (< i (length array2)) (push array1 (get array2 i)))
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
  (let array (Array 0))
  (loop iterate i bounds (block
    (push array (+ i start))
    (if (< i bounds) (iterate (+ i 1) bounds) array)))
  (iterate 0 (- end start))))
;; map
(function map array callback (block 
  (let new_array (Array 0))
  (let i 0)
  (loop iterate i bounds (block
    (set new_array i (callback (get array i) i))
    (if (< i bounds) (iterate (+ i 1) bounds) new_array)))
  (iterate 0 (- (length array) 1))))
;; for_each
(function for_each array callback (block
  (loop iterate i bounds (block
    (callback (get array i) i array)
    (if (< i bounds) (iterate (+ i 1) bounds) array)))
  (iterate 0 (- (length array) 1))))
;; filter
(function filter array callback (block
  (let new_array (Array 0))
  (let i 0)
  (loop iterate i bounds (block
    (let current (get array i))
    (if (callback current i) 
      (push new_array current))
    (if (< i bounds) (iterate (+ i 1) bounds) new_array)))
  (iterate 0 (- (length array) 1))))
;; reduce
(function reduce array callback initial (block
  (loop iterate i bounds (block
    (= initial (callback initial (get array i) i array))
    (if (< i bounds) (iterate (+ i 1) bounds) initial)))
  (iterate 0 (- (length array) 1))))
;; sum_array
(function sum_array array (reduce array (lambda a b i o (+ a b)) 0))
;; product_array
(function product_array array (reduce array (lambda a b i o (* a b)) 0))
;; deep_flat
(function deep_flat arr (block 
  (let new_array (Array 0)) 
  (loop flatten item (if (Arrayp item) (for_each item (lambda x _ (flatten x))) 
  (push new_array item)))
  (flatten arr) 
  new_array
))
;; find
(function find array callback (block
  (loop iterate i bounds (block
    (let current (get array i))
    (if (and (not (callback current i)) (< i bounds))
      (iterate (+ i 1) bounds) 
      current)))
      (iterate 0 (- (length array) 1))))
;; quick_sort
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
;; reverse 
(function reverse array (block
  (let len (length array))
  (let reversed (Array len))
  (let offset (- len 1))
  (loop iterate i bounds (block
    (set reversed (- offset i) (get array i))
    (if (< i bounds) (iterate (+ i 1) bounds) reversed)))
  (iterate 0 offset)))
;; binary_search
;; (function binary_search 
;;         arr target by greather start end
;;   (loop search 
;;         arr target start end (block
;;     (if (<= start end) 
;;       (block 
;;         (let index (floor (* (+ start end) 0.5)))
;;         (let current (get arr index))
;;         (let identity (by current))
;;         (if (eq current target) 
;;           current
;;           (if (eq (greather current)) 
;;             (search arr target start (- index 1))
;;             (search arr target (+ index 1) end))))))))

(function binary_search 
        array target (block
  (loop search 
        arr target start end (block
        (log start end)
    (if (<= start end) (block 
        (let index (floor (* (+ start end) 0.5)))
        (let current (get arr index))
        (if (eq target current) target
          (if (> current target) 
            (search arr target start (- index 1))
            (search arr target (+ index 1) end)
            )))))) 
   (search array target 0 (length array))))
;; std of wisp
