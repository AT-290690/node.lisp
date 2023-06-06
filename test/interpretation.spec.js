import { deepStrictEqual, strictEqual } from 'assert'
import { runFromInterpreted } from '../src/utils.js'
it('interpretation should work', () => {
  strictEqual(runFromInterpreted(`(if (< 1 2) 42 69)`), 42)
  strictEqual(runFromInterpreted(`(unless (< 1 2) 42 69)`), 69)
  deepStrictEqual(
    runFromInterpreted(`
(function min a b (if (< a b) a b))
(function push array value (set array (length array) value))
(function euclidean_mod a b (mod (+ (mod a b) b) b))
(function find array callback (block
  (loop iterate i bounds (block
    (let current (get array i))
    (if (and (not (callback current i array)) (< i bounds))
      (iterate (+ i 1) bounds) 
      current)))
      (iterate 0 (- (length array) 1))))
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
(function is_in_bounds array index (and (< index (length array)) (>= index 0)))
(function map array callback (block 
  (let new_array (Array 0))
  (let i 0)
  (loop iterate i bounds (block
    (set new_array i (callback (get array i) i array))
    (if (< i bounds) (iterate (+ i 1) bounds) new_array)))
  (iterate 0 (- (length array) 1))))

    (function hash_table_index 
      table key 
        (block
          (let total 0)
          (let prime_num 31)
          (let* key (... (type key String)))
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
          (unless (is_in_bounds table idx) (set table idx (Array 0)))
          (let current (get table idx))
          (let len (length current))
          (let index (if len (find_index current (lambda x i o (= (get x 0) key))) -1))
          (let entry (Array key value))
          (if (= index -1)
            (push current entry)
            (set current index entry)
          )
          table))
    (function hash_table_has table key 
      (and (is_in_bounds table (let idx (hash_table_index table key))) (length (get table idx))))
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
    (function hash_table 
      size 
        (map (Array size) (lambda x i o (Array 0))))
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
    
    (let tabl  (do
    (hash_table_make (Array 
      (Array "name" "Anthony") 
      (Array "age" 32) 
      (Array "skills" 
        (Array "Animation" "Programming"))))
  )) (hash_table_set tabl "age" 33)`),
    [
      [],
      [],
      [['skills', ['Animation', 'Programming']]],
      [
        ['name', 'Anthony'],
        ['age', 33],
      ],
    ]
  )
  deepStrictEqual(
    runFromInterpreted(`
    (function binary_tree_node 
            value (Array 
                    (Array "value" value)
                    (Array "left"  (Array 0))
                    (Array "right" (Array 0))))
    (function binary_tree_get_left 
                    node (get node 1))
    (function binary_tree_get_right 
                    node (get node 2))
    (function binary_tree_set_left 
                    tree node (set tree 1 node))
    (function binary_tree_set_right 
                    tree node (set tree 2 node)) 
    (function binary_tree_get_value
                    node (get node 0))
  (do 
    (binary_tree_node 1)
    (binary_tree_set_left 
          (do 
            (binary_tree_node 2) 
            (binary_tree_set_left 
              (do (binary_tree_node 4) 
                  (binary_tree_set_right 
                  (binary_tree_node 5))))))
    (binary_tree_set_right (binary_tree_node 3))
    (binary_tree_get_left)
    (binary_tree_get_left)
    (binary_tree_get_right))
  binary_tree_node`),
    [
      ['value', 5],
      ['left', []],
      ['right', []],
    ]
  )
  strictEqual(
    runFromInterpreted(`(let add_seq (lambda x (+ x 1 2 3)))
  (function mult_10 x (* x 10))
  (let do_thing (lambda (do 100 
                        (add_seq) 
                        (mult_10))))
  (do_thing)`),
    1060
  )
  deepStrictEqual(
    runFromInterpreted(`
    (function floor n (| n 0))
(function push array value (set array (length array) value))
(function array_to_numbers array (map array (lambda x i (type x Number))))
(function product_array array (reduce array (lambda a b i o (* a b)) 1))
(function split_by_lines string (regex_match string "[^\n]+"))
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


(Array
  (do input
  (split_by_lines)
  (array_to_numbers)
  (quick_sort)
  (solve1 (lambda x (- 2020 x)))
  (product_array))
(do input
  (split_by_lines)
  (array_to_numbers)
  (quick_sort)
  (solve2 (lambda x y (- 2020 x y)))
  (product_array)))
    `),
    [514579, 241861950]
  )

  deepStrictEqual(
    runFromInterpreted(`
(function floor n (| n 0))
(function min a b (if (< a b) a b))
(function push array value (set array (length array) value))
(function product_array array (reduce array (lambda a b i o (* a b)) 1))
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
    (set new_array i (callback (get array i) i array))
    (if (< i bounds) (iterate (+ i 1) bounds) new_array)))
  (iterate 0 (- (length array) 1))))
(function reduce array callback initial (block
  (loop iterate i bounds (block
    (let* initial (callback initial (get array i) i array))
    (if (< i bounds) (iterate (+ i 1) bounds) initial)))
  (iterate 0 (- (length array) 1))))

(let sample "1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc")
(let input sample)

(let occ (regex_match input "([0-9]{1,2}-[0-9]{1,2})"))
(let policy (regex_match input "[a-z](?=:)"))
(let inputs (regex_match input "(?<=:[ ])(.*)"))

(function solve1 string letter (block
  (let array (... string))
  (let bitmask 0)
  (let zero (char "a" 0))
  (let count 0)
  (let has_at_least_one 0)
  (loop iterate i bounds  (block
      (let ch (get array i))
      (let code (- (char ch 0) zero))
      (let mask (<< 1 code))
      (if (and (if (= ch letter) (let* has_at_least_one 1))
          (not (= (& bitmask mask) 0))) 
          (let* count (+ count 1))
          (let* bitmask (| bitmask mask)))
      (if (< i bounds) (iterate (+ i 1) bounds) 
      (+ count has_at_least_one))))
      (iterate 0 (- (length array) 1))))

(function solve2 array letter x y (block 
(let a (get array (- x 1)))
(let b (get array (- y 1)))
(let left (= letter a))
(let right (= letter b))
(and (not (and left right)) (or left right))
))

(Array (do occ
  (map (lambda x i o
              (do x
                (regex_match "[^-]+") 
                (map (lambda y i o (type y Number))))))
   (map (lambda x i o (do x 
            (push (get policy i)) 
            (push (get inputs i))
            (push (solve1 (get x 3) (get x 2)))
            (push (and 
                    (>= (get x 4) (get x 0)) 
                    (<= (get x 4) (get x 1)))))))
  (reduce (lambda a x i o (+ a (get x -1))) 0)
)
(do occ
  (map (lambda x i o (do x (regex_match "[^-]+") (map (lambda y i o (type y Number))))))
   (map (lambda x i o (do x 
            (push (get policy i)) 
            (push (get inputs i)))))
   (map (lambda x i o 
    (push x (solve2 (... (get x 3)) (get x 2) (get x 0) (get x 1)))
   ))
   (reduce (lambda a x i o (+ a (get x -1))) 0)
))`),
    [2, 1]
  )

  strictEqual(
    runFromInterpreted(`
  (let array (Array 5))
  (set array -5)
  (length array)
`),
    0
  )
  deepStrictEqual(
    runFromInterpreted(`
    (function push array value (set array (length array) value))
    (function concat array1 array2 (block
      (loop iterate i bounds (block
      (if (< i (length array2)) (push array1 (get array2 i)))
      (if (< i bounds) 
        (iterate (+ i 1) bounds)
      array1
      )))
    (iterate 0 (- (length array2) 1))))
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
    (function reverse array (block
      (let len (length array))
      (let reversed (Array len))
      (let offset (- len 1))
      (loop iterate i bounds (block
        (set reversed (- offset i) (get array i))
        (if (< i bounds) (iterate (+ i 1) bounds) reversed)))
      (iterate 0 offset)
      ))
    
      (do
        (Array 1 0 8 -2 3)
        (quick_sort)
        (reverse))
    `),
    [8, 3, 1, 0, -2]
  )
  strictEqual(
    runFromInterpreted(`(let find (lambda array callback (block
      (loop iterate i bounds (block
        (let current (get array i))
        (if (and (not (callback current i)) (< i bounds))
          (iterate (+ i 1) bounds) 
          current)))
          (iterate 0 (- (length array) 1)))))
    (find (Array 1 2 3 4 5 6) (lambda x i (= i 2)))`),
    3
  )
  deepStrictEqual(
    runFromInterpreted(`
    (let push (lambda array value (set array (length array) value)))
    (let for_each (lambda array callback (block
      (loop iterate i bounds (block
        (callback (get array i) i)
        (if (< i bounds) (iterate (+ i 1) bounds) array)))
      (iterate 0 (- (length array) 1)))))
    (let deep_flat (lambda arr (block 
      (let new_array (Array 0)) 
      (loop flatten item (if (Arrayp item) (for_each item (lambda x _ (flatten x))) 
      (push new_array item)))
      (flatten arr) 
      new_array
    )))
    (let arr (
    Array 
    (Array 1 2) 
    (Array 1 2) 
    (Array 1 3) 
    (Array 1 (Array 4 4 (Array "x" "y"))) 
    (Array 1 2))
  )
  (deep_flat arr)`),
    [1, 2, 1, 2, 1, 3, 1, 4, 4, 'x', 'y', 1, 2]
  )
  strictEqual(
    runFromInterpreted(`(loop iterate i (if (< i 100) 
  (iterate (+ i 1)) i))
(iterate 0)
`),
    100
  )
  deepStrictEqual(
    runFromInterpreted(`(let push (lambda array value (set array (length array) value)))
  (let concat (lambda array1 array2 (block
    (let iterate (lambda i bounds (block
    (push array1 (get array2 i))
    (if (< i bounds) 
      (iterate (+ i 1) bounds)
    array1
    ))))
  (iterate 0 (- (length array2) 1)))))

  (do
    (Array 1 2 3)
    (push -1)
    (concat (... "abc"))
    (concat (Array 1 2 3 4))
    (concat (Array 5 6 7))
  )`),
    [1, 2, 3, -1, 'a', 'b', 'c', 1, 2, 3, 4, 5, 6, 7]
  )
  strictEqual(
    runFromInterpreted(`(let range (lambda start end (block 
  (let array (Array 0))
  (let iterate (lambda i bounds (block
    (set array i (+ i start))
    (if (< i bounds) (iterate (+ i 1) bounds) array)
  )))
  (iterate 0 (- end start)))))
  
  
  (let map (lambda array callback (block 
  (let new_array (Array 0))
  (let i 0)
  (let iterate (lambda i bounds (block
    (set new_array i (callback (get array i) i))
    (if (< i bounds) (iterate (+ i 1) bounds) new_array)
  )))
  (iterate 0 (- (length array) 1)))))
  
  
  (let filter (lambda array callback (block 
  (let new_array (Array 0))
  (let i 0)
  (let iterate (lambda i bounds (block
    (let current (get array i))
    (if (callback current i) 
      (set new_array (length new_array) current))
    (if (< i bounds) (iterate (+ i 1) bounds) new_array)
  )))
  (iterate 0 (- (length array) 1)))))
  
  (let reduce (lambda array callback initial (block
    (let iterate (lambda i bounds (block
      (let* initial (callback initial (get array i) i))
      (if (< i bounds) (iterate (+ i 1) bounds) initial)
    )))
  (iterate 0 (- (length array) 1)))))
  

  (let is_odd (lambda x i (= (mod x 2) 1)))
  (let mult_2 (lambda x i (* x 2)))
  (let sum (lambda a x i (+ a x)))
  
  (do 
  (Array 1 2 3 4 5 6 7 101) 
  (filter is_odd)
  (map mult_2)
  (reduce sum 0))
  
  `),
    234
  )

  deepStrictEqual(
    runFromInterpreted(`
  (let sample 
    "1721
    979
    366
    299
    675
    1456")
    
    (let push (lambda array value (set array (length array) value)))
    
    (let max (lambda a b (if (> a b) a b)))
    (let min (lambda a b (if (< a b) a b)))
    
    (let map (lambda array callback (block 
    (let new_array (Array 0))
    (let i 0)
    (let iterate (lambda i bounds (block
      (set new_array i (callback (get array i) i))
      (if (< i bounds) (iterate (+ i 1) bounds) new_array)
    )))
    (iterate 0 (- (length array) 1)))))
    
    (let reduce (lambda array callback initial (block
      (let iterate (lambda i bounds (block
        (let* initial (callback initial (get array i) i))
        (if (< i bounds) (iterate (+ i 1) bounds) initial))))
    (iterate 0 (- (length array) 1)))))
    (let join (lambda array delim (reduce array (lambda a x i (concatenate a delim x)) "")))
    (let string_to_array (lambda string delim 
    (reduce (... string) (lambda a x i (block
        (if (= x delim) 
          (push a (Array 0)) 
          (block (push (get a -1) x) a)
        )))(push (Array 0) (Array 0)))))
    
     (let split_by_lines (lambda string (map (string_to_array string "\n") (lambda x i (join x "")))))
     
     (map (map 
      (split_by_lines sample) 
        (lambda x i (type x Number))) 
        (lambda x i (- 2020 x)))
  `),
    [299, 1041, 1654, 1721, 1345, 564]
  )

  strictEqual(
    runFromInterpreted(`(do 1 
    (+ 2) 
      (* 3 4)
       (- 3 2))`),
    31
  )
})
