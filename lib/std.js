export default `; (std lib)
(function std (block 
  ; modules
  ; max
  (function max a b (if (> a b) a b))
  ; min
  (function min a b (if (< a b) a b))
  ; normalize 
  (function normalize value min max (* (- value min) (/ (- max min))))
  ; linear-interpolation
  (function linear-interpolation a b n (+ (* (- 1 n) a) (* n b)))
  ; clamp
  (function clamp x limit (if (> x limit) limit x))
  ; is-odd
  (function is-odd x i (= (mod x 2) 1))
  ; is-even
  (function is-even x i (= (mod x 2) 0))
  ; manhattan-distance
  (function manhattan-distance x1 y1 x2 y2 (+ (abs (- x2 x1)) (abs (- y2 y1))))
  ; can-sum
  (function can-sum t values 
    (if (< t 0) 0 
      (if (= t 0) 1 
        (some values (lambda x _ _ (can-sum (- t x) values))))))
  ; how-can-sum
  (function how-can-sum t values 
    (if (< t 0) 0 
      (if (= t 0) () 
        (block 
          (let res 0)
          (some values (lambda x _ _ (block 
            (let* res (how-can-sum (- t x) values))
            (if (and (Arrayp res) (= -1 (array-index-of res x))) (push res x))))) 
          res))))
  ; push
  (function push array value (set array (length array) value))
  ; pop
  (function pop array (set array -1))
  ; array-in-bounds-p 
  (function array-in-bounds-p array index (and (< index (length array)) (>= index 0)))
  ; is-array-of-atoms
  (function is-array-of-atoms array (if (not (length array)) 1 (if (atom (car array)) (is-array-of-atoms (cdr array)) 0)))
  ; abs
  (function abs n (- (^ n (>> n 31)) (>> n 31)))
  ; floor
  (function floor n (| n 0))
  ; round a number
  (function round n (& (+ n 1) -2))
  ; euclidean-mod
  (function euclidean-mod a b (mod (+ (mod a b) b) b))
  ; euclidean-div
  (function euclidean-div a b (block 
                      (let q (* a (/ b)))
                      (if (< (mod a b) 0) (if (> b 0) (- q 1) (+ q 1)) q)))
; neighborhood
 (function neighborhood array directions y x callback
    (reduce directions (lambda sum dir _ _ 
        (block
          (let dy (+ (car dir) y))
          (let dx (+ (car (cdr dir)) x))
           (+ sum (if (and (array-in-bounds-p array dy) (array-in-bounds-p (get array dy) dx)) (callback (get (get array dy) dx) dir))))) 0))
  ; greatest-common-divisor
  (function greatest-common-divisor a b (if (= b 0) a (greatest-common-divisor b (mod a b))))
  ; remainder
  (function remainder n d (if (< n d) n (remainder (- n d) d)))
  ; factorial
  (function factorial n (if (= n 1) 1 (* n (factorial (- n 1)))))
  ; fibonacci
  (function fibonacci n (if (< n 2) n (+ (fibonacci (- n 1)) (fibonacci (- n 2)))))
  ; join
  (function join array delim (reduce array (lambda a x i o (concatenate a delim x)) ""))
  ; split-by-lines
  (function split-by-lines string (regex-match string "[^\n]+"))
  ; split-by
  (function split-by string delim (regex-match string (concatenate "[^" delim "]+")))
  ; trim
  (function trim string (regex-replace string "^\s+|\s+$" ""))
  ; array-of-numbers
  (function array-of-numbers array (map array (lambda x i o (type x Number))))
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
    (let array ())
    (loop iterate i bounds (block
      (push array (+ i start))
      (if (< i bounds) (iterate (+ i 1) bounds) array)))
    (iterate 0 (- end start))))
 ; sequance
  (function sequance end start step (block
    (let array ())
    (loop iterate i bounds (block
      (push array (+ i start))
      (if (< i bounds) (iterate (+ i step) bounds) array)))
    (iterate 0 (- end start))))
  ; map
  (function map array callback (block 
    (let new-array ())
    (let i 0)
    (loop iterate i bounds (block
      (set new-array i (callback (get array i) i array))
      (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
    (iterate 0 (- (length array) 1))))
  ; for-each
  (function for-each array callback (block
    (loop iterate i bounds (block
      (callback (get array i) i array)
      (if (< i bounds) (iterate (+ i 1) bounds) array)))
    (iterate 0 (- (length array) 1))))
  ; for-n
  (function for-n N callback (block
    (loop iterate i (block 
        (let res (callback i))
        (if (< i N) (iterate (+ i 1)) res))) 
        (iterate 0)))
  ; for-range
  (function for-range start end callback (block
    (loop iterate i (block 
        (let res (callback i))
        (if (< i end) (iterate (+ i 1)) res))) 
        (iterate start)))
  ; count
  (function count array callback (block
    (let amount 0)
    (loop iterate i bounds (block
      (let current (get array i))
      (if (callback current i array) (let* amount (+ amount 1)))
      (if (< i bounds) (iterate (+ i 1) bounds) amount)))
    (iterate 0 (- (length array) 1))))
  ; partition 
  (function partition array n (reduce array (lambda a x i _ (block 
        (if (mod i n) (push (get a -1) x) (push a (Array x))) a)) 
        ()))
  ; filter
  (function remove array callback (block
    (let new-array ())
    (loop iterate i bounds (block
      (let current (get array i))
      (if (callback current i array) 
        (push new-array current))
      (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
    (iterate 0 (- (length array) 1))))
; every
(function every array callback (block
    (let bol 1)
    (loop iterate i bounds (block
      (let res (callback (get array i) i array))
      (boole bol (type res Boolean))
      (if (and res (< i bounds)) (iterate (+ i 1) bounds) bol)))
    (iterate 0 (- (length array) 1))))
; some
(function some array callback (block
    (let bol 1)
    (loop iterate i bounds (block
      (let res (callback (get array i) i array))
      (boole bol (type res Boolean))
      (if (and (not res) (< i bounds)) (iterate (+ i 1) bounds) bol)))
    (iterate 0 (- (length array) 1))))
  ; reduce
  (function reduce array callback initial (block
    (loop iterate i bounds (block
      (let* initial (callback initial (get array i) i array))
      (if (< i bounds) (iterate (+ i 1) bounds) initial)))
    (iterate 0 (- (length array) 1))))
      ; reduce
(function accumulate array callback (block
  (let initial (get array 0))
  (loop iterate i bounds (block
    (let* initial (callback initial (get array i) i array))
    (if (< i bounds) (iterate (+ i 1) bounds) initial)))
  (iterate 0 (- (length array) 1))))
  ; sum-array
  (function sum-array array (reduce array (lambda a b _ _ (+ a b)) 0))
  ; product-array
  (function product-array array (reduce array (lambda a b _ _ (* a b)) 1))
  ; deep-flat
  (function deep-flat arr (block 
    (let new-array ()) 
    (loop flatten item 
      (if (and (Arrayp item) (length item)) 
            (for-each item (lambda x _ _ (flatten x))) 
            (unless (Arrayp item) (push new-array item))))
    (flatten arr) 
    new-array))
  ; find
(function find array callback (block
        (loop iterate i bounds (block
          (let current (get array i))
          (let has (callback current i array))
          (if (and (not has) (< i bounds))
            (iterate (+ i 1) bounds) 
            (if has current))))
            (iterate 0 (- (length array) 1))))
  ; find-index
  (function find-index array callback (block
    (let idx -1)
    (let has-found 0)
    (loop iterate i bounds (block
      (let current (get array i))
      (boole has-found (callback current i array))
      (if (and (not has-found) (< i bounds))
        (iterate (+ i 1) bounds) 
        (let* idx i))))
        (iterate 0 (- (length array) 1))
        (if has-found idx -1)))
; index-of
  (function index-of array target (block
    (let idx -1)
    (let has-found 0)
    (loop iterate i bounds (block
      (let current (get array i))
      (boole has-found (= target current))
      (if (and (not has-found) (< i bounds))
        (iterate (+ i 1) bounds) 
        (let* idx i))))
        (iterate 0 (- (length array) 1))
        (if has-found idx -1)))
   ; array-index-of
  (function array-index-of array target 
    (block
      (if (= (length array) 0) -1 
        (block 
          (let idx -1)
          (let has-found 0)
          (loop iterate i bounds (block
            (let current (get array i))
            (boole has-found (= target current))
            (if (and (not has-found) (< i bounds))
              (iterate (+ i 1) bounds) 
              (let* idx i))))
              (iterate 0 (- (length array) 1))
              (if has-found idx -1)))))
  ; quick-sort
  (function quick-sort arr (block
    (if (<= (length arr) 1) arr
    (block
      (let pivot (get arr 0))
      (let left-arr ())
      (let right-arr ())
  (loop iterate i bounds (block
      (let current (get arr i))
      (if (< current pivot) 
          (push left-arr current)
          (push right-arr current))
      (if (< i bounds) (iterate (+ i 1) bounds))))
      (iterate 1 (- (length arr) 1))
  (do 
    left-arr (quick-sort) 
    (push pivot) 
    (concat (quick-sort right-arr)))))))
  ; reverse 
  (function reverse array (block
    (let len (length array))
    (let reversed (Array len length))
    (let offset (- len 1))
    (loop iterate i bounds (block
      (set reversed (- offset i) (get array i))
      (if (< i bounds) (iterate (+ i 1) bounds) reversed)))
    (iterate 0 offset)))
  ; binary-search
  (function binary-search 
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
  ;   (hash-table-make (Array 
  ;     (Array "name" "Anthony") 
  ;     (Array "age" 32) 
  ;     (Array "skills" 
  ;       (Array "Animation" "Programming"))))
  ;   (log)
  ; )
  ; hash-index
  (function hash-index 
    table key 
      (block
        (let total 0)
        (let prime-num 31)
        (let key-arr (. (type key String)))
        (loop find-hash-index i bounds (block 
          (let letter (get key-arr i))
          (let value (- (char letter 0) 96))
          (let* total (euclidean-mod (+ (* total prime-num) value) (length table)))
          (if (< i bounds) (find-hash-index (+ i 1) bounds) total)))
        (find-hash-index 0 (min (- (length key-arr) 1) 100))))
    ; hash-table-set
  (function hash-table-set 
    table key value 
      (block
        (let idx (hash-index table key))
        (unless (array-in-bounds-p table idx) (set table idx ()))
        (let current (get table idx))
        (let len (length current))
        (let index (if len (find-index current (lambda x i o (= (get x 0) key))) -1))
        (let entry (Array key value))
        (if (= index -1)
          (push current entry)
          (set current index entry)
        )
        table))
  ; hash table_has 
  (function hash-table-has table key 
    (and (array-in-bounds-p table (let idx (hash-index table key))) (and (length (let current (get table idx))) (>= (index-of (car current) key) 0))))
  ; hash-table-get
  (function hash-table-get
    table key 
      (block
        (let idx (hash-index table key))
        (if (array-in-bounds-p table idx) 
          (block
            (let current (get table idx))
            (do current
              (find (lambda x _ _ (= key 
                      (do x (get 0)))))
              (get 1))))))
  ; hash-table
  (function hash-table 
    size 
      (map (Array size length) (lambda _ _ _ ())))
  ; hash-table-make
  (function hash-table-make 
    items 
      (block
        (let len (- (length items) 1))
        (let table (hash-table (* len len)))
        (loop add i (block
          (let item (get items i))
          (hash-table-set table (get item 0) (get item 1))
        (if (< i len) (add (+ i 1)) table)))
        (add 0)))
  ; (/ Hash Table)
  ; (Hash Set)
  ; (do
  ;   (hash-set-make (Array "A" "B" "C"))
  ;   (hash-set-set "A")
  ;   (hash-set-set "D")
  ;   (log)
  ; )

(function hash-index 
    table key 
      (block
        (let total 0)
        (let prime-num 31)
        (let key-arr (. (type key String)))
        (loop find-hash-index i bounds (block 
          (let letter (get key-arr i))
          (let value (- (char letter 0) 96))
          (let* total (euclidean-mod (+ (* total prime-num) value) (length table)))
          (if (< i bounds) (find-hash-index (+ i 1) bounds) total)))
        (find-hash-index 0 (min (- (length key-arr) 1) 100))))
    ; hash-set-set
  (function hash-set-set 
    table key 
      (block
        (let idx (hash-index table key))
        (unless (array-in-bounds-p table idx) (set table idx ()))
        (let current (get table idx))
        (let len (length current))
        (let index (if len (find-index current (lambda x i o (= x key))) -1))
        (let entry key)
        (if (= index -1)
          (push current entry)
          (set current index entry)
        )
        table))
  ; hash table_has 
  (function hash-set-has table key 
    (and (array-in-bounds-p table (let idx (hash-index table key))) (and (length (let current (get table idx))) (>= (index-of current key) 0))))
  ; hash-set-get
  (function hash-set-get
    table key 
      (block
        (let idx (hash-index table key))
        (if (array-in-bounds-p table idx) 
          (block
            (let current (get table idx))
            (do current
              (find (lambda x _ _ (= key x))))))))
  ; hash-set
  (function hash-set 
    size 
      (map (Array size length) (lambda _ _ _ ())))
  ; hash-set-make
  (function hash-set-make 
    items 
      (block
        (let len (- (length items) 1))
        (let table (hash-set (* len len)))
        (loop add i (block
          (let item (get items i))
          (hash-set-set table item)
        (if (< i len) (add (+ i 1)) table)))
        (add 0)))
; (/ Hash Set)

  ; (Binary Tree)
  ; (do 
  ; (binary-tree-node 1)
  ; (binary-tree-set-left (do 
  ;                         (binary-tree-node 2) 
  ;                         (binary-tree-set-left 
  ;                           (do (binary-tree-node 4) 
  ;                               (binary-tree-set-right 
  ;                               (binary-tree-node 5))))))
  ; (binary-tree-set-right (binary-tree-node 3))
  ; (binary-tree-get-left)
  ; (binary-tree-get-left)
  ; (binary-tree-get-right))
  ; binary-tree-node
  (function binary-tree-node 
          value (Array 
                  (Array "value" value)
                  (Array "left"  ())
                  (Array "right" ())))
  ; binary-tree-get-left
  (function binary-tree-get-left 
                  node (get node 1))
  ; binary-tree-get-right
  (function binary-tree-get-right 
                  node (get node 2))
  ; binary-tree-set-left
  (function binary-tree-set-left 
                  tree node (set tree 1 node))
  ; binary-tree-set-right
  (function binary-tree-set-right 
                  tree node (set tree 2 node)) 
  ; binary-tree-get-value
  (function binary-tree-get-value
                  node (get node 0))  
  ; (/ Binary Tree)
  
  ; occurances_count
  (function character-occurances-in-string string letter (block
    (let array (. string))
    (let bitmask 0)
    (let zero (char "a" 0))
    (let count 0)
    (let has-at-least-one 0)
    (loop iterate i bounds  (block
        (let ch (get array i))
        (let code (- (char ch 0) zero))
        (let mask (<< 1 code))
        (if (and (if (= ch letter) (boole has-at-least-one 1))
            (not (= (& bitmask mask) 0))) 
            (let* count (+ count 1))
            (let* bitmask (| bitmask mask)))
        (if (< i bounds) (iterate (+ i 1) bounds) 
        (+ count has-at-least-one))))
        (iterate 0 (- (length array) 1))))
; split-by-n-lines
(function split-by-n-lines string n (do string (regex-replace (concatenate "(\n){" n "}") "௮") (regex-match "[^௮]+") (map (lambda x _ _ (regex-match x "[^\n]+")))))
; split
(function split string separator (block 
    (let cursor "")
    (let sepArr (. separator))
    (let array (. string))
    (let skip (length sepArr))
    (loop iterate result i bounds
      (if (< (if (every sepArr (lambda y j _ (= (get array (+ i j)) y)))
            (block 
              (let* i (+ i skip -1))
              (push result cursor)
              (let* cursor "")
              i)
            (block (let* cursor (concatenate cursor (get array i))) i)) bounds) 
                (iterate result (+ i 1) bounds) result))
    (push (iterate () 0 (- (length array) 1)) cursor)))

  ; slice 
  (function slice array start end (block 
    (let bounds (- end start))
    (let out (Array bounds length))
    (loop iterate i 
      (if (< i bounds) 
          (block 
            (set out i (get array (+ start i))) 
            (iterate (+ i 1)))
           out))
          (iterate 0)))
  ; slice-if-index
  (function slice-if-index array callback (reduce array (lambda a b i _ (if (callback i) (push a b) a)) ()))
  ; slice-if
  (function slice-if array callback (reduce array (lambda a b i _ (if (callback b i) (push a b) a)) ()))
  ; equal 
  (function equal a b 
   (or (and (atom a) (atom b) (= a b)) 
   (and (Arrayp a) 
        (= (length a) (length b)) 
          (not (some a (lambda _ i _ (not (equal (get a i) (get b i)))))))))
  ; adjacent-difference
  (function adjacent-difference array callback (block 
    (let len (length array))
    (unless (= len 1) 
    (block (let result (Array (car array)))
    (loop iterate i (if (< i len) (block 
    (set result i (callback (get array (- i 1)) (get array i)))
    (iterate (+ i 1))) result))
    (iterate 1)) array)))
  ; exports
  (Array 
    (Array "max" max)
    (Array "min" min) 
    (Array "is-odd" is-odd) 
    (Array "is-even" is-even) 
    (Array "push" push)
    (Array "pop" pop)
    (Array "array-in-bounds-p" array-in-bounds-p)  
    (Array "abs" abs)
    (Array "floor" floor)
    (Array "round" round)
    (Array "euclidean-mod" euclidean-mod)
    (Array "euclidean-div" euclidean-div)
    (Array "join" join)
    (Array "trim" trim)
    (Array "split-by-lines" split-by-lines)
    (Array "split-by" split-by)
    (Array "split-by-n-lines" split-by-n-lines)
    (Array "split" split)
    (Array "array-of-numbers" array-of-numbers)
    (Array "concat" concat)
    (Array "merge" merge)
    (Array "range" range)
    (Array "map" map)
    (Array "for-each" for-each)
    (Array "for-n" for-n)
    (Array "for-range" for-range)
    (Array "remove" remove)
    (Array "reduce" reduce)
    (Array "sum-array" sum-array)
    (Array "product-array" product-array)
    (Array "deep-flat" deep-flat)
    (Array "find" find)
    (Array "find-index" find-index)
    (Array "quick-sort" quick-sort)
    (Array "reverse" reverse)
    (Array "binary-search" binary-search)
    (Array "hash-table-set" hash-table-set)
    (Array "hash-table-has" hash-table-has)
    (Array "hash-table-get" hash-table-get)
    (Array "hash-table" hash-table)
    (Array "hash-table-make" hash-table-make)
    (Array "hash-set-set" hash-set-set)
    (Array "hash-set-has" hash-set-has)
    (Array "hash-set-get" hash-set-get)
    (Array "hash-set" hash-set)
    (Array "hash-set-make" hash-set-make)
    (Array "binary-tree-node" binary-tree-node)
    (Array "binary-tree-get-left" binary-tree-get-left)
    (Array "binary-tree-get-right" binary-tree-get-right)
    (Array "binary-tree-set-right" binary-tree-set-right)
    (Array "binary-tree-set-left" binary-tree-set-left)
    (Array "binary-tree-get-value" binary-tree-get-value)
    (Array "character-occurances-in-string" character-occurances-in-string)
    (Array "greatest-common-divisor" greatest-common-divisor)
    (Array "remainder" remainder)
    (Array "factorial" factorial)
    (Array "fibonacci" fibonacci)
    (Array "every" every)
    (Array "some" some)
    (Array "index-of" index-of)
    (Array "array-index-of" array-index-of)
    (Array "accumulate" accumulate)
    (Array "count" count)
    (Array "partition" partition)
    (Array "slice" slice)
    (Array "slice-if" slice-if)
    (Array "slice-if-index" slice-if-index)
    (Array "equal" equal)
    (Array "can-sum" how-can-sum)
    (Array "how-can-sum" how-can-sum)
    (Array "adjacent-difference" adjacent-difference)
    (Array "neighborhood" neighborhood)
    (Array "clamp" clamp)
    (Array "manhattan-distance" manhattan-distance)
    (Array "normalize" normalize)
    (Array "linear-interpolation" linear-interpolation)
  )
))
; (/ std lib)`
