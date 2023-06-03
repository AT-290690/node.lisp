; (std lib)
(function std (block 
  ; max
  (function max a b (if (> a b) a b))
  ; min
  (function min a b (if (< a b) a b))
  ; is_odd
  (function is_odd x i (= (mod x 2) 1))
  ; is_even
  (function is_even x i (= (mod x 2) 0))
  ; push
  (function push array value (set array (length array) value))
  ; pop
  (function pop array value (set array -1))
  ; is_in_bounds
  (function is_in_bounds array index (and (< index (length array)) (>= index 0)))
  ; abs
  (function abs n (- (^ n (>> n 31)) (>> n 31)))
  ; floor
  (function floor n (| n 0))
  ; round a number
  (function round n (& (+ n 1) -2))
  ; euclidean_mod
  (function euclidean_mod a b (mod (+ (mod a b) b) b))
  ; euclidean_div
  (function euclidean_div a b (block 
                      (let q (* a (/ b)))
                      (if (< (mod a b) 0) (if (> b 0) (- q 1) (+ q 1)) q)))
  ; join
  (function join array delim (reduce array (lambda a x i o (concatenate a delim x)) ""))
  ; string_to_array
  (function string_to_array string delim 
                        (reduce (... string) 
                          (lambda a x i o (block
                                    (if (= x delim) (push a (Array 0)) (block 
                                      (push (get a -1) x) a))))(push (Array 0) (Array 0))))
  ; split_by_lines
  (function split_by_lines string (map (string_to_array string (esc "n")) (lambda x i o (join x ""))))
  ; concat
  (function concat array1 array2 (block
    (loop iterate i bounds (block
    (if (< i (length array2)) (push array1 (get array2 i)))
    (if (< i bounds) 
      (iterate (+ i 1) bounds)
    array1
    )))
  (iterate 0 (- (length array2) 1))))
  ; merge
  (function merge array1 array2 (block
    (loop iterate i bounds (block
    (push array1 (get array2 i))
    (if (< i bounds) 
      (iterate (+ i 1) bounds)
    array1
    )))
  (iterate 0 (- (length array2) 1))))
  ; range
  (function range start end (block
    (let array (Array 0))
    (loop iterate i bounds (block
      (push array (+ i start))
      (if (< i bounds) (iterate (+ i 1) bounds) array)))
    (iterate 0 (- end start))))
  ; map
  (function map array callback (block 
    (let new_array (Array 0))
    (let i 0)
    (loop iterate i bounds (block
      (set new_array i (callback (get array i) i array))
      (if (< i bounds) (iterate (+ i 1) bounds) new_array)))
    (iterate 0 (- (length array) 1))))
  ; for_each
  (function for_each array callback (block
    (loop iterate i bounds (block
      (callback (get array i) i array)
      (if (< i bounds) (iterate (+ i 1) bounds) array)))
    (iterate 0 (- (length array) 1))))
  ; filter
  (function filter array callback (block
    (let new_array (Array 0))
    (let i 0)
    (loop iterate i bounds (block
      (let current (get array i))
      (if (callback current i) 
        (push new_array current))
      (if (< i bounds) (iterate (+ i 1) bounds) new_array)))
    (iterate 0 (- (length array) 1))))
  ; reduce
  (function reduce array callback initial (block
    (loop iterate i bounds (block
      (let* initial (callback initial (get array i) i array))
      (if (< i bounds) (iterate (+ i 1) bounds) initial)))
    (iterate 0 (- (length array) 1))))
  ; sum_array
  (function sum_array array (reduce array (lambda a b i o (+ a b)) 0))
  ; product_array
  (function product_array array (reduce array (lambda a b i o (* a b)) 0))
  ; deep_flat
  (function deep_flat arr (block 
    (let new_array (Array 0)) 
    (loop flatten item (if (Arrayp item) (for_each item (lambda x _ o (flatten x))) 
    (push new_array item)))
    (flatten arr) 
    new_array
  ))
  ; find
  (function find array callback (block
    (loop iterate i bounds (block
      (let current (get array i))
      (if (and (not (callback current i array)) (< i bounds))
        (iterate (+ i 1) bounds) 
        current)))
        (iterate 0 (- (length array) 1))))
  ; find_index
  (function find_index array callback (block
    (let idx -1)
    (let has_found 0)
    (loop iterate i bounds (block
      (let current (get array i))
      (let* has_found (callback current i array))
      (if (and (not (callback current i array)) (< i bounds))
        (iterate (+ i 1) bounds) 
        (let* idx i))))
        (iterate 0 (- (length array) 1))
        (if has_found idx -1)))
  ; quick_sort
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
  ; reverse 
  (function reverse array (block
    (let len (length array))
    (let reversed (Array len))
    (let offset (- len 1))
    (loop iterate i bounds (block
      (set reversed (- offset i) (get array i))
      (if (< i bounds) (iterate (+ i 1) bounds) reversed)))
    (iterate 0 offset)))
  ; binary_search
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
  ; (Hash Table)
  ; (do
  ;   (hash_table_make (Array 
  ;     (Array "name" "Anthony") 
  ;     (Array "age" 32) 
  ;     (Array "skills" 
  ;       (Array "Animation" "Programming"))))
  ;   (log)
  ; )
  ; hash_table_index
  (function hash_table_index 
    table key 
      (block
        (let total 0)
        (let prime_num 31)
        (let* key (... (type String key)))
        (loop find_hash_index i bounds (block 
          (let letter (get key i))
          (let value (- (char letter 0) 96))
          (let* total (euclidean_mod (+ (* total prime_num) value) (length table)))
          (if (< i bounds) (find_hash_index (+ i 1) bounds) total)))
        (find_hash_index 0 (min (- (length key) 1) 100))))
    ; hash_table_set
  (function hash_table_set 
    table key value 
      (block
        (let idx (hash_table_index table key))
        (if (not (is_in_bounds table idx)) (set table idx (Array 0)))
        (let current (get table idx))
        (let len (length current))
        (let index (if len (find_index current (lambda x i o (= (get x 0) key))) -1))
        (let entry (Array key value))
        (if (= index -1)
          (push current entry)
          (set current index entry)
        )
        table))
  ; hash table_has 
  (function hash_table_has table key 
    (and (is_in_bounds table (let idx (hash_table_index table key))) (length (get table idx))))
  ; hash_table_get
  (function hash_table_get
    table key 
      (block
        (let idx (hash_table_index table key))
        (if (is_in_bounds table idx) 
          (block
            (let current (get table idx))
            (do current
              (find (lambda x i o (= key 
                      (do x (get 0)))))
              (get 1))))))
  ; hash_table
  (function hash_table 
    size 
      (map (Array size) (lambda x i o (Array 0))))
  ; hash_table_make
  (function hash_table_make 
    items 
      (block
        (let len (- (length items) 1))
        (let table (hash_table (* len len)))
        (loop add i (block
          (let item (get items i))
          (hash_table_set table (get item 0) (get item 1))
        (if (< i len) (add (+ i 1)) table)))
        (add 0)))
  ; (/ Hash Table)
  ; (Hash Set)
  ; (do
  ;   (hash_set_make (Array "A" "B" "C"))
  ;   (hash_set_set "A")
  ;   (hash_set_set "D")
  ;   (log)
  ; )

  (function hash_set_index 
    table key 
      (block
        (let total 0)
        (let prime_num 31)
        (let* key (... (type String key)))
        (loop find_hash_index i bounds (block 
          (let letter (get key i))
          (let value (- (char letter 0) 96))
          (let* total (euclidean_mod (+ (* total prime_num) value) (length table)))
          (if (< i bounds) (find_hash_index (+ i 1) bounds) total)))
        (find_hash_index 0 (min (- (length key) 1) 100))))
    ; hash_set_set
  (function hash_set_set 
    table key 
      (block
        (let idx (hash_set_index table key))
        (if (not (is_in_bounds table idx)) (set table idx (Array 0)))
        (if (not (length (let current (do table (get idx))))) 
          (push current key))
        table))
  ; hash table_has 
  (function hash_set_has table key 
    (and (is_in_bounds table (let idx (hash_set_index table key))) (length (get table idx))))
  ; hash_set_get
  (function hash_set_get
    table key 
      (block
        (let idx (hash_set_index table key))
        (if (is_in_bounds table idx) 
          key)))
  ; hash_set
  (function hash_set 
    size 
      (map (Array size) (lambda x i o (Array 0))))
  ; hash_set_make
  (function hash_set_make 
    items 
      (block
        (let len (- (length items) 1))
        (let table (hash_set (* len len)))
        (loop add i (block
          (let item (get items i))
          (hash_set_set table item)
        (if (< i len) (add (+ i 1)) table)))
        (add 0)))
  ; (/ Hash Set)

  ; (Binary Tree)
  ; (do 
  ; (binary_tree_node 1)
  ; (binary_tree_set_left (do 
  ;                         (binary_tree_node 2) 
  ;                         (binary_tree_set_left 
  ;                           (do (binary_tree_node 4) 
  ;                               (binary_tree_set_right 
  ;                               (binary_tree_node 5))))))
  ; (binary_tree_set_right (binary_tree_node 3))
  ; (binary_tree_get_left)
  ; (binary_tree_get_left)
  ; (binary_tree_get_right))
  ; binary_tree_node
  (function binary_tree_node 
          value (Array 
                  (Array "value" value)
                  (Array "left"  (Array 0))
                  (Array "right" (Array 0))))
  ; binary_tree_get_left
  (function binary_tree_get_left 
                  node (get node 1))
  ; binary_tree_get_right
  (function binary_tree_get_right 
                  node (get node 2))
  ; binary_tree_set_left
  (function binary_tree_set_left 
                  tree node (set tree 1 node))
  ; binary_tree_set_right
  (function binary_tree_set_right 
                  tree node (set tree 2 node)) 
  ; binary_tree_get_value
  (function binary_tree_get_value
                  node (get node 0))  
  ; (/ Binary Tree)



  (Array 
    (Array "max" min)
    (Array "min" min) 
    (Array "is_odd" is_odd) 
    (Array "is_even" is_even) 
    (Array "push" push)
    (Array "pop" pop)
    (Array "is_in_bounds" is_in_bounds)  
    (Array "abs" abs)
    (Array "floor" floor)
    (Array "round" round)
    (Array "euclidean_mod" euclidean_mod)
    (Array "euclidean_div" euclidean_div)
    (Array "join" join)
    (Array "string_to_array" string_to_array)
    (Array "split_by_lines" split_by_lines)
    (Array "concat" concat)
    (Array "merge" merge)
    (Array "range" range)
    (Array "map" map)
    (Array "for_each" for_each)    
    (Array "filter" filter)
    (Array "reduce" reduce)
    (Array "sum_array" sum_array)
    (Array "product_array" product_array)
    (Array "deep_flat" deep_flat)
    (Array "find" find)
    (Array "find_index" find_index)
    (Array "quick_sort" quick_sort)
    (Array "reverse" reverse)
    (Array "binary_search" binary_search)
    (Array "hash_table_index" hash_table_index)
    (Array "hash_table_set" hash_table_set)
    (Array "hash_table_has" hash_table_has)
    (Array "hash_table_get" hash_table_get)
    (Array "hash_table" hash_table)
    (Array "hash_table_make" hash_table_make)
    (Array "hash_set_set" hash_set_set)
    (Array "hash_set_has" hash_set_has)
    (Array "hash_set_get" hash_set_get)
    (Array "hash_set" hash_set)
    (Array "hash_set_make" hash_set_make)
    (Array "binary_tree_node" binary_tree_node)
    (Array "binary_tree_get_left" binary_tree_get_left)
    (Array "binary_tree_get_right" binary_tree_get_right)
    (Array "binary_tree_set_right" binary_tree_set_right)
    (Array "binary_tree_set_left" binary_tree_set_left)
    (Array "binary_tree_get_value" binary_tree_get_value)
  )
))
; (/ std lib)