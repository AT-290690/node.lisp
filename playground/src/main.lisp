(let hello "Hello World")
(log (concatenate hello "!!!"))

(function min a b (if (< a b) a b))
(function push array value (set array (length array) value))
(function is_in_bounds array index (or (< index (length array) (>= index 0))))
(function find array callback (block
  (loop iterate i bounds (block
    (let current (get array i))
    (if (and (not (callback current i array)) (< i bounds))
      (iterate (+ i 1) bounds) 
      current)))
      (iterate 0 (- (length array) 1))))
      
(function hash_table_index table key (block
  (let total 0)
  (let prime_num 31)
  (= key (... key))
  (loop find_hash_index i bounds (block 
    (let letter (get key i))
    (let value (- (char letter 0) 96))
    (= total (mod (+ (* total prime_num) value) (length table)))
    (if (< i bounds) (find_hash_index (+ i 1) bounds) total)))
  (find_hash_index 0 (min (- (length key) 1) 100))))

(function hash_table_set table key value (block
  (let idx (hash_table_index table key))
  (if (not (is_in_bounds table idx)) (set table idx (Array 0)))
  (do table (get idx) (push (Array key value)))
  (table)))

(function hash_table_get table key (block
  (let idx (hash_table_index table key))
  (if (is_in_bounds table idx) 
    (block
      (let current (get table idx))
      (do current
        (find (lambda x i o (eq key 
                (do x (get 0)))))
        (get 1))))))

(do 
  (' (Array 0) (Array 0) (Array 0) (Array 0) (Array 0))
  (hash_table_set "x" 10)
    (hash_table_set "m" 210)
    (hash_table_get "m")
  (log)
)