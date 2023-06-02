; deps
(function min 
  a b 
    (if (< a b) a b))
(function is_in_bounds array 
  index 
    (and (< index (length array)) (> index 0)))
(function find array 
  callback 
    (block
      (loop iterate i bounds 
        (block
          (let current (get array i))
          (if (and (not (callback current i array)) (< i bounds))
            (iterate (+ i 1) bounds) 
            current)))
            (iterate 0 (- (length array) 1))))
(function push array 
  value 
    (set array (length array) value))
(function map array 
  callback 
    (block 
      (let new_array (Array 0))
      (let i 0)
      (loop iterate i bounds (block
        (set new_array i (callback (get array i) i array))
        (if (< i bounds) (iterate (+ i 1) bounds) new_array)))
      (iterate 0 (- (length array) 1))))

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
        (let* total (mod (+ (* total prime_num) value) (length table)))
        (if (< i bounds) (find_hash_index (+ i 1) bounds) total)))
      (find_hash_index 0 (min (- (length key) 1) 100))))
  ; hash_table_set
(function hash_table_set 
  table key value 
    (block
      (let idx (hash_table_index table key))
      (if (not (is_in_bounds table idx)) (set table idx (Array 0)))
      (do table (get idx) (push (Array key value)))
      (table)))
; hash table_has 
(function hash_table_has table key 
  (is_in_bounds table (hash_table_index table key)))
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

  
  