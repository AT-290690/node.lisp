; (ds lib)
(defun ds (do
; modules
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
            (set current (length current) entry)
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
            (set current (length current) entry)
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
  (Array 
    (Array "hash-index" hash-index)
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
   )))
; (/ ds lib)
