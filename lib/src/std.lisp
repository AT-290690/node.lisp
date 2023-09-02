; (std lib)
(defun std (do
  ; modules
  ; push  
  (defun push array value (set array (length array) value))
  ; pop
  (deftype pop (Lambda (Or (Array)) (Or (Array))))
  (defun pop array (set array -1))
  ; yoink
  (defun yoink array (when (length array) (do (defconstant last (get array -1)) (set array -1) last)))
  ; array-in-bounds-p 
  (deftype array-in-bounds-p (Lambda (Or (Array)) (Or (Number)) (Or (Number))))
  (defun array-in-bounds-p array index (and (< index (length array)) (>= index 0)))
  ; is-array-of-atoms
  (deftype is-array-of-atoms (Lambda (Or (Array)) (Or (Number))))
  (defun is-array-of-atoms array (if (not (length array)) 1 (if (atom (car array)) (is-array-of-atoms (cdr array)) 0)))
  ; cartesian-product
  (deftype cartesian-product (Lambda (Or (Array)) (Or (Array)) (Or (Array (Array)))))
  (defun cartesian-product a b (reduce a (lambda p x . . (merge p (map b (lambda y . . (Array x y))))) (Array)))
  ; neighborhood
  (deftype neighborhood (Lambda (Or (Array (Array (Number)))) (Or (Array (Array (Number)))) (Or (Number)) (Or (Number)) (Or (Function)) (Or (Number))))
  (defun neighborhood array directions y x callback
      (reduce directions (lambda sum dir . . (do
          (defconstant
              dy (+ (car dir) y)
              dx (+ (car (cdr dir)) x))
          (+ sum (when (and (array-in-bounds-p array dy) (array-in-bounds-p (get array dy) dx)) (callback (get (get array dy) dx) dir))))) 0))
      ; join
      (deftype join (Lambda (Or (Array)) (Or (String)) (Or (String))))
      (defun join array delim (reduce array (lambda a x i . (if (> i 0) (concatenate a delim (type x String)) (type x String))) ""))
      ; repeat
      (defun repeat n x (map (Array n length) (lambda . . . x)))
      ; split-by-lines
      (deftype split-by-lines (Lambda (Or (String)) (Or (Array (String)))))
      (defun split-by-lines string (regex-match string "[^\n]+"))
      ; split-by
      (deftype split-by (Lambda (Or (String)) (Or (String)) (Or (Array (String)))))
      (defun split-by string delim (regex-match string (concatenate "[^" delim "]+")))
      ; trim
      (defun trim string (regex-replace string "^\s+|\s+$" ""))
      ; array-of-numbers
      (deftype array-of-numbers (Lambda (Or (Array)) (Or (Array (Number)))))
      (defun array-of-numbers array (map array (lambda x . . (type x Number))))
      ; concat
      (deftype concat (Lambda (Or (Array)) (Or (Array)) (Or (Array))))
      (defun concat array1 array2 (do
        (loop defun iterate i bounds (do
        (when (< i (length array2)) (push array1 (get array2 i)))
        (if (< i bounds) 
          (iterate (+ i 1) bounds)
        array1
        )))
      (iterate 0 (- (length array2) 1))))
      ; merge
      (deftype merge (Lambda (Or (Array)) (Or (Array)) (Or (Array))))
      (defun merge array1 array2 (do
        (loop defun iterate i bounds (do
        (push array1 (get array2 i))
        (if (< i bounds) 
          (iterate (+ i 1) bounds)
        array1
        )))
      (iterate 0 (- (length array2) 1))))
      ; map
      (deftype map (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
      (defun map array callback (do
        (defconstant new-array (Array))
        (defvar i 0)
        (loop defun iterate i bounds (do
          (set new-array i (callback (get array i) i array))
          (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
        (iterate 0 (- (length array) 1))))
      ; for-each
      (defun for-each array callback (do
        (loop defun iterate i bounds (do
          (callback (get array i) i array)
          (if (< i bounds) (iterate (+ i 1) bounds) array)))
        (iterate 0 (- (length array) 1))))
  ; for-n
  (defun for-n N callback (do
    (loop defun iterate i (do 
        (defconstant res (callback i))
        (if (< i N) (iterate (+ i 1)) res))) 
        (iterate 0)))
  ; for-range
  (defun for-range start end callback (do
    (loop defun iterate i (do 
        (defconstant res (callback i))
        (if (< i end) (iterate (+ i 1)) res))) 
        (iterate start)))
  ; count-of
  (deftype count-of (Lambda (Or (Array)) (Or (Function)) (Or (Number))))
  (defun count-of array callback (do
    (defvar amount 0)
    (loop defun iterate i bounds (do
      (defconstant current (get array i))
      (when (callback current i array) (setf amount (+ amount 1)))
      (if (< i bounds) (iterate (+ i 1) bounds) amount)))
    (iterate 0 (- (length array) 1))))
  ; partition 
  (deftype partition (Lambda (Or (Array)) (Or (Number)) (Or (Array (Array)))))
  (defun partition array n (reduce array (lambda a x i . (do 
        (if (mod i n) (push (get a -1) x) (push a (Array x))) a)) 
        (Array)))
  ; remove
  (deftype remove (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
  (defun remove array callback (do
    (defconstant new-array (Array))
    (loop defun iterate i bounds (do
      (defconstant current (get array i))
      (when (callback current i array) 
        (push new-array current))
      (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
    (iterate 0 (- (length array) 1))))
  ; every
  (deftype every (Lambda (Or (Array)) (Or (Function)) (Or (Number))))
  (defun every array callback (do
      (defvar bol 1)
      (loop defun iterate i bounds (do
        (defconstant res (callback (get array i) i array))
        (boole bol (type res Boolean))
        (if (and res (< i bounds)) (iterate (+ i 1) bounds) bol)))
      (iterate 0 (- (length array) 1))))
  ; some
  (deftype some (Lambda (Or (Array)) (Or (Function)) (Or (Number))))
  (defun some array callback (do
      (defvar bol 1)
      (loop defun iterate i bounds (do
        (defconstant res (callback (get array i) i array))
        (boole bol (type res Boolean))
        (if (and (not res) (< i bounds)) (iterate (+ i 1) bounds) bol)))
      (iterate 0 (- (length array) 1))))
  ; reduce
  (deftype reduce (Lambda (Or (Array)) (Or (Function)) (Or (Array) (Number) (Integer) (String)) (Or (Array) (Number) (Integer) (String))))
  (defun reduce array callback initial (do
    (loop defun iterate i bounds (do
      (setf initial (callback initial (get array i) i array))
      (if (< i bounds) (iterate (+ i 1) bounds) initial)))
    (iterate 0 (- (length array) 1))))
    ; accumulate
    (deftype accumulate (Lambda (Or (Array)) (Or (Function)) (Or (Array) (Number) (Integer) (String))))
    (defun accumulate array callback (do
      (defvar initial (get array 0))
      (loop defun iterate i bounds (do
        (setf initial (callback initial (get array i) i array))
        (if (< i bounds) (iterate (+ i 1) bounds) initial)))
      (iterate 0 (- (length array) 1))))
    ; iteration 
    (deftype iteration (Lambda (Or (Function)) (Or (Number)) (Or (Array))))
    (defun iteration callback n (reduce (defconstant arr (Array n length)) (lambda a . i . (set a i (callback (get a -1) i))) arr))
    ; iteration 
    (defun repeated-apply initial callback i (do 
      (loop defun iterate result callback i (if (> i 0) (iterate (callback result) callback (- i 1)) result))
      (iterate initial callback i)))
    ; deep-flat
    (defun deep-flat arr (do 
      (defconstant new-array (Array)) 
      (defconstant flatten (lambda item 
        (if (and (Arrayp item) (length item)) 
              (for-each item (lambda x . . (flatten x))) 
              (otherwise (Arrayp item) (push new-array item)))))
      (flatten arr) 
      new-array))
    ; find
    (defun find array callback (do
            (loop defun iterate i bounds (do
              (defconstant 
                current (get array i) 
                has (callback current i array))
              (if (and (not has) (< i bounds))
                (iterate (+ i 1) bounds) 
                (when has current))))
                (iterate 0 (- (length array) 1))))
    ; find-index
      (defun find-index array callback (do
        (defvar idx -1 has-found 0)
        (loop defun iterate i bounds (do
          (defconstant current (get array i))
          (boole has-found (callback current i array))
          (if (and (not has-found) (< i bounds))
            (iterate (+ i 1) bounds) 
            (setf idx i))))
            (iterate 0 (- (length array) 1))
            (if has-found idx -1)))
    ; index-of
    (defun index-of array target (do
      (defvar idx -1 has-found 0)
      (loop defun iterate i bounds (do
        (defconstant current (get array i))
        (boole has-found (and (atom current) (= target current)))
        (if (and (not has-found) (< i bounds))
          (iterate (+ i 1) bounds) 
          (setf idx i))))
          (iterate 0 (- (length array) 1))
          (if has-found idx -1)))
      ; last-index-of
      (defun last-index-of array target (do
        (defvar idx -1 has-found 0)
        (loop defun iterate i (do
          (defconstant current (get array i))
          (boole has-found (= target current))
          (if (and (not has-found) (>= i 0))
            (iterate (- i 1)) 
            (setf idx i))))
            (iterate (- (length array) 1))
            (if has-found idx -1)))
      ; index-of-starting-from
    (defun index-of-starting-from array target start (do
      (defvar idx -1 has-found 0)
      (loop defun iterate i bounds (do
        (defconstant current (get array i))
        (boole has-found (= target current))
        (if (and (not has-found) (< i bounds))
          (iterate (+ i 1) bounds) 
          (setf idx i))))
          (iterate start (- (length array) 1))
          (if has-found idx -1)))
      ; last-index-of-ending-from
      (defun last-index-of-ending-from array target end (do
        (defvar idx -1 has-found 0)
        (loop defun iterate i (do
          (defconstant current (get array i))
          (boole has-found (= target current))
          (if (and (not has-found) (>= i 0))
            (iterate (- i 1)) 
            (setf idx i))))
            (iterate (- (length array) 1 (* end -1)))
            (if has-found idx -1)))
      ; array-index-of
      (defun array-index-of array target 
        (do
          (if (= (length array) 0) -1 
            (do 
              (defvar idx -1 has-found 0)
              (loop defun iterate i bounds (do
                (defconstant current (get array i))
                (boole has-found (= target current))
                (if (and (not has-found) (< i bounds))
                  (iterate (+ i 1) bounds) 
                  (setf idx i))))
                  (iterate 0 (- (length array) 1))
                  (if has-found idx -1)))))
      ; quick-sort
      (deftype quick-sort (Lambda (Or (Array (Number))) (Or (Array (Number)))))
      (defun quick-sort arr (do
        (if (<= (length arr) 1) arr
        (do
          (defconstant 
            pivot (get arr 0) 
            left-arr (Array) 
            right-arr (Array))
        (loop defun iterate i bounds (do
          (defconstant current (get arr i))
          (if (< current pivot) 
              (push left-arr current)
              (push right-arr current))
          (when (< i bounds) (iterate (+ i 1) bounds))))
          (iterate 1 (- (length arr) 1))
      (go 
        left-arr (quick-sort) 
        (push pivot) 
        (concat (quick-sort right-arr)))))))
      ; reverse 
      (deftype reverse (Lambda (Or (Array)) (Or (Array))))
      (defun reverse array (do
        (defconstant len (length array))
        (if (> len 1) (do
        (defconstant 
          reversed (Array len length)
          offset (- len 1))
        (loop defun iterate i bounds (do
          (set reversed (- offset i) (get array i))
          (if (< i bounds) (iterate (+ i 1) bounds) reversed)))
        (iterate 0 offset)) array)))
      ; binary-search
      (defun binary-search 
              array target (do
        (loop defun search 
              arr target start end (do
          (when (<= start end) (do 
              (defconstant 
                index (| (* (+ start end) 0.5) 0)
                current (get arr index))
              (if (= target current) target
                (if (> current target) 
                  (search arr target start (- index 1))
                  (search arr target (+ index 1) end))))))) 
        (search array target 0 (length array))))
      ; sort-by-length 
      (deftype sort-by-length (Lambda (Or (Array)) (Or (Array (Number))) (Or (Array))))
      (defun sort-by-length array order (map order (lambda x . . (find array (lambda y . . (= (- (length y) 1) x))))))
      ; order-array
      (deftype order-array (Lambda (Or (Array)) (Or (Array (Number))) (Or (Array))))
      (defun order-array array order (map (Array (length array) length) (lambda . i . (get array (get order i)))))
      ; euclidean-mod
      (defun euclidean-mod a b (mod (+ (mod a b) b) b))
      ; hash-index
      (defun hash-index 
        table key 
          (do
            (defconstant 
              prime-num 31
              key-arr (type (type key String) Array))
            (defvar total 0)
            (loop defun find-hash-index i bounds (do 
              (defconstant 
                letter (get key-arr i) 
                value (- (char-code letter 0) 96))
              (setf total (euclidean-mod (+ (* total prime-num) value) (length table)))
              (if (< i bounds) (find-hash-index (+ i 1) bounds) total)))
            (find-hash-index 0 
            (if (< (- (length key-arr) 1) 100) (- (length key-arr) 1) 100))))

      ; (Hash Table)
      ; (go 
      ;   (hash-table-make (Array 
      ;     (Array "name" "Anthony") 
      ;     (Array "age" 32) 
      ;     (Array "skills" 
      ;       (Array "Animation" "Programming"))))
      ;   (log)
      ; )
        ; hash-table-set
      (defun hash-table-set 
        table key value 
          (do
            (defconstant idx (hash-index table key))
            (otherwise (array-in-bounds-p table idx) (set table idx (Array)))
            (defconstant 
              current (get table idx)
              len (length current)
              index (if len (find-index current (lambda x . . (= (get x 0) key))) -1)
              entry (Array key value))
            (if (= index -1)
              (push current entry)
              (set current index entry)
            )
            table))
      ; hash-table-remove
      (defun hash-table-remove 
        table key 
          (do
            (defconstant idx (hash-index table key))
            (otherwise (array-in-bounds-p table idx) (set table idx (Array)))
            (defconstant 
              current (get table idx)
              len (length current)
              index (if len (find-index current (lambda x . . (= (get x 0) key))) -1))
            (otherwise (= index -1) (and (set current index (get current -1)) (set current -1)))
            table))        
      ; hash table_has 
      (defun hash-table-has table key 
        (and (array-in-bounds-p table (defconstant idx (hash-index table key))) (and (length (defconstant current (get table idx))) (>= (index-of (car current) key) 0))))
      ; hash-table-get
      (defun hash-table-get
        table key 
          (do
            (defconstant idx (hash-index table key))
            (if (array-in-bounds-p table idx) 
              (do
                (defconstant current (get table idx))
                (go current
                  (find (lambda x . . (= key 
                          (go x (get 0)))))
                  (get 1))))))
      ; hash-table
      (defun hash-table 
        size 
          (map (Array size length) (lambda . . . (Array))))
      ; hash-table-make
      (defun hash-table-make 
        items 
          (do
            (defconstant 
              len (- (length items) 1)
              table (hash-table (* len len)))
            (loop defun add i (do
              (defconstant item (get items i))
              (hash-table-set table (get item 0) (get item 1))
            (if (< i len) (add (+ i 1)) table)))
            (add 0)))
        ; hash-set-set
      (defun hash-set-set 
        table key 
          (do
            (defconstant idx (hash-index table key))
            (otherwise (array-in-bounds-p table idx) (set table idx (Array)))
            (defconstant 
              current (get table idx)
              len (length current)
              index (if len (find-index current (lambda x . . (= x key))) -1)
              entry key)
            (if (= index -1)
              (push current entry)
              (set current index entry)
            )
            table))
      ; hash-set-remove
      (defun hash-set-remove 
        table key 
          (do
            (defconstant idx (hash-index table key))
            (otherwise (array-in-bounds-p table idx) (set table idx (Array)))
            (defconstant 
              current (get table idx)
              len (length current)
              index (if len (find-index current (lambda x . . (= x key))) -1)
              entry key)
            (otherwise (= index -1) (and (set current index (get current -1)) (set current -1)))
            table))
      ; hash table_has 
      (defun hash-set-has table key 
        (and (array-in-bounds-p table (defconstant idx (hash-index table key))) (and (length (defconstant current (get table idx))) (>= (index-of current key) 0))))
      ; hash-set-get
      (defun hash-set-get table key (do
            (defconstant idx (hash-index table key))
            (if (array-in-bounds-p table idx) (do
                (defconstant current (get table idx))
                (go current
                  (find (lambda x . . (= key x))))))))
      ; hash-set
      (defun hash-set size (map (Array size length) (lambda . . . (Array))))
      ; hash-set-make
      (defun hash-set-make items (do
          (defconstant 
            len (- (length items) 1)
            table (hash-set (* len len)))
          (loop defun add i (do
            (defconstant item (get items i))
            (hash-set-set table item)
          (if (< i len) (add (+ i 1)) table)))
          (add 0)))
    ; (/ Hash Set)

      ; (Binary Tree)
      ; (go 
      ; (binary-tree-node 1)
      ; (binary-tree-set-left (go 
      ;                         (binary-tree-node 2) 
      ;                         (binary-tree-set-left 
      ;                           (go (binary-tree-node 4) 
      ;                               (binary-tree-set-right 
      ;                               (binary-tree-node 5))))))
      ; (binary-tree-set-right (binary-tree-node 3))
      ; (binary-tree-get-left)
      ; (binary-tree-get-left)
      ; (binary-tree-get-right))
      ; binary-tree-node
      (defun binary-tree-node value 
        (Array 
          (Array "value" value)
          (Array "left"  (Array))
          (Array "right" (Array))))
      ; binary-tree-get-left
      (defun binary-tree-get-left node (get node 1))
      ; binary-tree-get-right
      (defun binary-tree-get-right node (get node 2))
      ; binary-tree-set-left
      (defun binary-tree-set-left tree node (set tree 1 node))
      ; binary-tree-set-right
      (defun binary-tree-set-right tree node (set tree 2 node)) 
      ; binary-tree-get-value
      (defun binary-tree-get-value node (get node 0))  
      ; (/ Binary Tree)
      ; left-pad
      (deftype left-pad (Lambda (Or (String)) (Or (Number)) (Or (String)) (Or (String))))
      (defun left-pad str n ch (do 
        (setf n (- n (length str)))
        (loop defun pad i str (if (< i n) (pad (+ i 1) (setf str (concatenate ch str))) str))
        (pad 0 str)))
        ; left-pad
      (deftype right-pad (Lambda (Or (String)) (Or (Number)) (Or (String)) (Or (String))))
      (defun right-pad str n ch (do 
        (setf n (- n (length str)))
        (loop defun pad i str (if (< i n) (pad (+ i 1) (setf str (concatenate str ch))) str))
        (pad 0 str)))
      ; occurances_count
      (deftype character-occurances-in-string (Lambda (Or (String)) (Or (String)) (Or (Number))))
      (defun character-occurances-in-string string letter (do
        (defvar 
          array (type string Array)
          bitmask 0
          zero (char-code "a" 0)
          count 0
          has-at-least-one 0)
        (loop defun iterate i bounds  (do
            (defconstant 
              ch (get array i)
              code (- (char-code ch 0) zero)
              mask (<< 1 code))
            (if (and (when (= ch letter) (boole has-at-least-one 1))
                (not (= (& bitmask mask) 0))) 
                (setf count (+ count 1))
                (setf bitmask (| bitmask mask)))
            (if (< i bounds) (iterate (+ i 1) bounds) 
            (+ count has-at-least-one))))
            (iterate 0 (- (length array) 1))))
    ;  to-upper-case
    (deftype to-upper-case (Lambda (Or (String)) (Or (String))))
    (defun to-upper-case str (do
     (defconstant 
            arr (Array) 
            n (length str))
      (loop defun iter i (if (< i n) (do 
        (defconstant current-char (char-code str i))
        (set arr i 
          (if (and (>= current-char 97) (<= current-char 122))
            (- current-char 32)
            current-char
        ))
        (iter (+ i 1))) 
        (make-string arr)))
        (iter 0)))
    ;  to-lower-case
    (deftype to-lower-case (Lambda (Or (String)) (Or (String))))
    (defun to-lower-case str (do
      (defconstant 
            arr (Array) 
            n (length str))
      (loop defun iter i (if (< i n) (do 
        (defconstant current-char (char-code str i))
        (set arr i 
          (if (and (>= current-char 65) (<= current-char 90))
            (+ current-char 32)
            current-char
        ))
        (iter (+ i 1))) 
        (make-string arr)))
        (iter 0)))
    ; split-by-n-lines
    (deftype split-by-n-lines (Lambda (Or (String)) (Or (Number)) (Or (Array (Array (String))))))
    (defun split-by-n-lines string n (go string (regex-replace (concatenate "(\n){" (type n String) "}") "௮") (regex-match "[^௮]+") (map (lambda x . . (regex-match x "[^\n]+")))))
    ; split
    (deftype split (Lambda (Or (String)) (Or (String)) (Or (Array (String)))))
    (defun split string separator (do
        (defconstant 
          sep-arr (type separator Array)
          array (type string Array)
          skip (length sep-arr))
        (defvar cursor "")
        (loop defun iterate result i bounds
          (if (< (if (every sep-arr (lambda y j . (or (<= (length array) (+ i j)) (= (get array (+ i j)) y))))
                (do 
                  (setf i (+ i skip -1))
                  (push result cursor)
                  (setf cursor "")
                  i)
                (do (setf cursor (concatenate cursor (get array i))) i)) bounds) 
                    (iterate result (+ i 1) bounds) result))
        (push (iterate (Array) 0 (- (length array) 1)) cursor)))
      ; slice 
      (deftype slice (Lambda (Or (Array)) (Or (Number)) (Or (Number)) (Or (Array))))
      (defun slice array start end (do 
        (defconstant bounds (- end start) out (Array bounds length))
        (loop defun iterate i 
          (if (< i bounds) 
              (do 
                (set out i (get array (+ start i))) 
                (iterate (+ i 1)))
              out))
              (iterate 0)))
      ; slice-if-index
      (deftype slice-if-index (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
      (defun slice-if-index array callback (reduce array (lambda a b i . (if (callback i) (push a b) a)) (Array)))
      ; slice-if
      (deftype slice-if (Lambda (Or (Array)) (Or (Function)) (Or Array)))
      (defun slice-if array callback (reduce array (lambda a b i . (if (callback b i) (push a b) a)) (Array)))
      ; window
      (deftype window (Lambda (Or (Array)) (Or (Number)) (Or (Array (Array)))))
      (defun window array n (go array
        (reduce (lambda acc current i all 
          (if (>= i n) 
            (push acc (slice all (- i n) i)) acc)) (Array))))
      ; equal 
      (defun equal a b 
      (or (and (atom a) (atom b) (= a b)) 
      (and (Arrayp a) 
            (= (length a) (length b)) 
              (not (some a (lambda . i . (not (equal (get a i) (get b i)))))))))
    (Array 
      (Array "push" push)
      (Array "pop" pop)
      (Array "yoink" yoink)
      (Array "sort-by-length" sort-by-length)  
      (Array "order-array" order-array)  
      (Array "array-in-bounds-p" array-in-bounds-p)  
      (Array "join" join)
      (Array "trim" trim)
      (Array "split-by-lines" split-by-lines)
      (Array "split-by" split-by)
      (Array "split-by-n-lines" split-by-n-lines)
      (Array "split" split)
      (Array "array-of-numbers" array-of-numbers)
      (Array "concat" concat)
      (Array "merge" merge)
      (Array "map" map)
      (Array "for-each" for-each)
      (Array "for-n" for-n)
      (Array "for-range" for-range)
      (Array "remove" remove)
      (Array "reduce" reduce)
      (Array "deep-flat" deep-flat)
      (Array "find" find)
      (Array "find-index" find-index)
      (Array "quick-sort" quick-sort)
      (Array "reverse" reverse)
      (Array "binary-search" binary-search)
      (Array "hash-table-set" hash-table-set)
      (Array "hash-table-remove" hash-table-remove)
      (Array "hash-table-has" hash-table-has)
      (Array "hash-table-get" hash-table-get)
      (Array "hash-table" hash-table)
      (Array "hash-table-make" hash-table-make)
      (Array "hash-set-set" hash-set-set)
      (Array "hash-set-has" hash-set-has)
      (Array "hash-set-remove" hash-set-remove)
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
      (Array "every" every)
      (Array "some" some)
      (Array "index-of" index-of)
      (Array "last-index-of" last-index-of)
      (Array "index-of-starting-from" index-of-starting-from)
      (Array "last-index-of-ending-from" last-index-of-ending-from)
      (Array "array-index-of" array-index-of)
      (Array "accumulate" accumulate)
      (Array "count-of" count-of)
      (Array "partition" partition)
      (Array "slice" slice)
      (Array "slice-if" slice-if)
      (Array "slice-if-index" slice-if-index)
      (Array "equal" equal)
      (Array "neighborhood" neighborhood)
      (Array "repeat" repeat)
      (Array "window" window)
      (Array "left-pad" left-pad)
      (Array "right-pad" right-pad)
      (Array "to-upper-case" to-upper-case)
      (Array "to-lower-case" to-lower-case)
      (Array "cartesian-product" cartesian-product)
      (Array "euclidean-mod" euclidean-mod)
      (Array "repeated-apply" repeated-apply)
      (Array "iteration" iteration))))
; (/ std lib)