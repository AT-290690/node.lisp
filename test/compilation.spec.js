import { deepStrictEqual } from 'assert'
import { runFromCompiled, runFromInterpreted } from '../src/utils.js'
describe('Compilation', () => {
  it('Should match interpretation', () =>
    [
      `(defvar x 8)
(or (cond 
(= x 10) "Ten"
(= x 9) "Nine"
(= x 8) "Eight") "NaN")`,
      `(defvar T (lambda x (lambda y (lambda (* 5 x y)))))
  (apply (apply (apply T 10) 3))`,
      ` (defvar bol (Boolean))
    (Array bol (boole bol 1) (boole bol 0) (boole bol 1) (boole bol 0))`,
      `(defun some array callback (block
      (defvar bol 1)
      (loop iterate i bounds (block
        (defvar res (callback (get array i) i array))
        (boole bol (type res Boolean))
        (if (and (not res) (< i bounds)) (iterate (+ i 1) bounds) bol)))
      (iterate 0 (- (length array) 1))))
        (defun equal a b 
     (or (and (atom a) (atom b) (= a b)) 
     (and (Arrayp a) 
          (= (length a) (length b)) 
            (not (some a (lambda _ i _ (not (equal (get a i) (get b i)))))))))
    (defvar patten (Array "hello" 10))
    (defvar patten2 (Array "hello" 11))
  (Array (equal patten (Array "hello" 10)) (equal patten (Array "hello" patten2)) 
  (Array 
    (equal 1 1) 
    (equal 1 2)
    (equal (Array 1 2) (Array 1 2))
    (equal (Array 1 2) (Array 1 2 3))
    (equal (Array 1 2) (Array 1 2 (Array 1 2)))
    (equal (Array 1 (Array 1 2)) (Array 1 2 (Array 1 2)))
    (equal (Array 1 2 (Array 1 2)) (Array 1 2 (Array 1 2)))))`,
      `(cdr (Array 1 2 3 4))`,
      `(car (Array 1 2 3 4))`,
      `(defvar x -1) (do x (-))`,
      `(defvar x -1) (- x)`,
      `(- 1)`,
      `(Array 10 length)`,
      `(Array 10)`,
      `(if (< 1 2) 42 69)`,
      `(unless (< 1 2) 42 69)`,
      `(defun min a b (if (< a b) a b))
  (defun push array value (set array (length array) value))
  (defun euclidean-mod a b (mod (+ (mod a b) b) b))
  (defun find array callback (block
    (loop iterate i bounds (block
      (defvar current (get array i))
      (if (and (not (callback current i array)) (< i bounds))
        (iterate (+ i 1) bounds) 
        current)))
        (iterate 0 (- (length array) 1))))
  (defun find-index array callback (block
    (defvar idx -1)
    (defvar has-found 0)
    (loop iterate i bounds (block
      (defvar current (get array i))
      (setf has-found (callback current i array))
      (if (and (not has-found) (< i bounds))
        (iterate (+ i 1) bounds) 
        (setf idx i))))
        (iterate 0 (- (length array) 1))
        (if has-found idx -1)))
  (defun array-in-bounds-p array index (and (< index (length array)) (>= index 0)))
  (defun map array callback (block 
    (defvar new-array ())
    (defvar i 0)
    (loop iterate i bounds (block
      (set new-array i (callback (get array i) i array))
      (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
    (iterate 0 (- (length array) 1))))
  
      (defun hash-index 
        table key 
          (block
            (defvar total 0)
            (defvar prime-num 31)
            (defvar key-arr (conjugate (type key String)))
            (loop find-hash-index i bounds (block 
              (defvar letter (get key-arr i))
              (defvar value (- (char letter 0) 96))
              (setf total (euclidean-mod (+ (* total prime-num) value) (length table)))
              (if (< i bounds) (find-hash-index (+ i 1) bounds) total)))
            (find-hash-index 0 (min (- (length key-arr) 1) 100))))
        ; hash-table-set
      (defun hash-table-set 
        table key value 
          (block
            (defvar idx (hash-index table key))
            (unless (array-in-bounds-p table idx) (set table idx ()))
            (defvar current (get table idx))
            (defvar len (length current))
            (defvar index (if len (find-index current (lambda x i o (= (get x 0) key))) -1))
            (defvar entry (Array key value))
            (if (= index -1)
              (push current entry)
              (set current index entry)
            )
            table))
      (defun hash-table-has table key 
        (and (array-in-bounds-p table (defvar idx (hash-index table key))) (length (get table idx))))
      (defun hash-table-get
        table key 
          (block
            (defvar idx (hash-index table key))
            (if (array-in-bounds-p table idx) 
              (block
                (defvar current (get table idx))
                (do current
                  (find (lambda x i o (= key 
                          (do x (get 0)))))
                  (get 1))))))
      (defun hash-table 
        size 
          (map (Array size length) (lambda x i o ())))
      (defun hash-table-make 
        items 
          (block
            (defvar len (- (length items) 1))
            (defvar table (hash-table (* len len)))
            (loop add i (block
              (defvar item (get items i))
              (hash-table-set table (get item 0) (get item 1))
            (if (< i len) (add (+ i 1)) table)))
            (add 0)))
      
      (defvar tabl  (do
      (hash-table-make (Array 
        (Array "name" "Anthony") 
        (Array "age" 32) 
        (Array "skills" 
          (Array "Animation" "Programming"))))
    )) (hash-table-set tabl "age" 33)`,
      ` (defun binary-tree-node 
      value (Array 
              (Array "value" value)
              (Array "left"  ())
              (Array "right" ())))
(defun binary-tree-get-left 
              node (get node 1))
(defun binary-tree-get-right 
              node (get node 2))
(defun binary-tree-set-left 
              tree node (set tree 1 node))
(defun binary-tree-set-right 
              tree node (set tree 2 node)) 
(defun binary-tree-get-value
              node (get node 0))
(do 
(binary-tree-node 1)
(binary-tree-set-left 
    (do 
      (binary-tree-node 2) 
      (binary-tree-set-left 
        (do (binary-tree-node 4) 
            (binary-tree-set-right 
            (binary-tree-node 5))))))
(binary-tree-set-right (binary-tree-node 3))
(binary-tree-get-left)
(binary-tree-get-left)
(binary-tree-get-right))`,
      `(defvar add_seq (lambda x (+ x 1 2 3)))
  (defun mult_10 x (* x 10))
  (defvar do_thing (lambda (do 100 
                        (add_seq) 
                        (mult_10))))
  (do_thing)`,
      `(defun binary-tree-node 
      value (Array 
              (Array "value" value)
              (Array "left"  ())
              (Array "right" ())))
(defun binary-tree-get-left 
              node (get node 1))
(defun binary-tree-get-right 
              node (get node 2))
(defun binary-tree-set-left 
              tree node (set tree 1 node))
(defun binary-tree-set-right 
              tree node (set tree 2 node)) 
(defun binary-tree-get-value
              node (get node 0))
(do 
(binary-tree-node 1)
(binary-tree-set-left (do 
                      (binary-tree-node 2) 
                      (binary-tree-set-left 
                        (do (binary-tree-node 4) 
                            (binary-tree-set-right 
                            (binary-tree-node 5))))))
(binary-tree-set-right (binary-tree-node 3))
(binary-tree-get-left)
(binary-tree-get-left)
(binary-tree-get-right))`,
      `(defun floor n (| n 0))
(defun push array value (set array (length array) value))
(defun array-of-numbers array (map array (lambda x i (type x Number))))
(defun product-array array (reduce array (lambda a b i o (* a b)) 1))
(defun split-by-lines string (regex-match string "[^\n]+"))
(defun string_to_array string delim 
                    (reduce (conjugate string) 
                      (lambda a x i o (block
                                (if (= x delim) (push a ()) (block 
                                  (push (get a -1) x) a))))(push () ())))
(defun join array delim (reduce array (lambda a x i o (concatenate a delim x)) ""))

(defun concat array1 array2 (block
(loop iterate i bounds (block
(if (< i (length array2)) (push array1 (get array2 i)))
(if (< i bounds) 
  (iterate (+ i 1) bounds)
array1)))
(iterate 0 (- (length array2) 1))))

(defun map array callback (block 
(defvar new-array ())
(defvar i 0)
(loop iterate i bounds (block
  (set new-array i (callback (get array i) i))
  (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
(iterate 0 (- (length array) 1))))

(defun reduce array callback initial (block
(loop iterate i bounds (block
  (setf initial (callback initial (get array i) i array))
  (if (< i bounds) (iterate (+ i 1) bounds) initial)))
(iterate 0 (- (length array) 1))))

(defun quick-sort arr (block
(if (<= (length arr) 1) arr
(block
  (defvar pivot (get arr 0))
  (defvar left-arr ())
  (defvar right-arr ())
(loop iterate i bounds (block
  (defvar current (get arr i))
  (if (< current pivot) 
      (push left-arr current)
      (push right-arr current))
  (if (< i bounds) (iterate (+ i 1) bounds))))
  (iterate 1 (- (length arr) 1))
(do 
left-arr (quick-sort) 
(push pivot) 
(concat (quick-sort right-arr)))))))

(defun binary-search 
      array target (block
(loop search 
      arr target start end (block
  (if (<= start end) (block 
      (defvar index (floor (* (+ start end) 0.5)))
      (defvar current (get arr index))
      (if (= target current) target
        (if (> current target) 
          (search arr target start (- index 1))
          (search arr target (+ index 1) end))))))) 
 (search array target 0 (length array))))

(defvar sample "1721
979
366
299
675
1456")

(defvar input sample)

(defun solve1 array cb 
   (reduce array (lambda a x i array (block
      (defvar res (binary-search array (cb x)))
      (if res (push a res) a))) 
   ()))

(defun solve2 array cb 
  (reduce array
    (lambda accumulator y i array (block
        (loop iterate j bounds (block 
            (defvar x (get array j))
            (defvar res (binary-search array (cb x y)))
            (if res (push accumulator res))
          (if (< j bounds) (iterate (+ j 1) bounds)
      accumulator)))
      (iterate i (- (length array) 1)))) 
   ()))
(Array
(do input
(split-by-lines)
(array-of-numbers)
(quick-sort)
(solve1 (lambda x (- 2020 x)))
(product-array))
(do input
(split-by-lines)
(array-of-numbers)
(quick-sort)
(solve2 (lambda x y (- 2020 x y)))
(product-array)))
  `,
      `(defun floor n (| n 0))
    (defun min a b (if (< a b) a b))
    (defun push array value (set array (length array) value))
    (defun product-array array (reduce array (lambda a b i o (* a b)) 1))
    (defun join array delim (reduce array (lambda a x i o (concatenate a delim x)) ""))
    (defun concat array1 array2 (block
      (loop iterate i bounds (block
      (if (< i (length array2)) (push array1 (get array2 i)))
      (if (< i bounds) 
        (iterate (+ i 1) bounds)
      array1)))
    (iterate 0 (- (length array2) 1))))
    (defun map array callback (block 
      (defvar new-array ())
      (defvar i 0)
      (loop iterate i bounds (block
        (set new-array i (callback (get array i) i array))
        (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
      (iterate 0 (- (length array) 1))))
    (defun reduce array callback initial (block
      (loop iterate i bounds (block
        (setf initial (callback initial (get array i) i array))
        (if (< i bounds) (iterate (+ i 1) bounds) initial)))
      (iterate 0 (- (length array) 1))))
    
    (defvar sample "1-3 a: abcde
    1-3 b: cdefg
    2-9 c: ccccccccc")
    (defvar input sample)
    
    (defvar occ (regex-match input "([0-9]{1,2}-[0-9]{1,2})"))
    (defvar policy (regex-match input "[a-z](?=:)"))
    (defvar inputs (regex-match input "(?<=:[ ])(.*)"))
    
    (defun solve1 string letter (block
      (defvar array (conjugate string))
      (defvar bitmask 0)
      (defvar zero (char "a" 0))
      (defvar count 0)
      (defvar has-at-least-one 0)
      (loop iterate i bounds  (block
          (defvar ch (get array i))
          (defvar code (- (char ch 0) zero))
          (defvar mask (<< 1 code))
          (if (and (if (= ch letter) (setf has-at-least-one 1))
              (not (= (& bitmask mask) 0))) 
              (setf count (+ count 1))
              (setf bitmask (| bitmask mask)))
          (if (< i bounds) (iterate (+ i 1) bounds) 
          (+ count has-at-least-one))))
          (iterate 0 (- (length array) 1))))
    
    (defun solve2 array letter x y (block 
    (defvar a (get array (- x 1)))
    (defvar b (get array (- y 1)))
    (defvar left (= letter a))
    (defvar right (= letter b))
    (and (not (and left right)) (or left right))
    ))
    
    
    (Array (do occ
      (map (lambda x i o
                  (do x
                    (regex-match "[^-]+") 
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
      (map (lambda x i o (do x (regex-match "[^-]+") (map (lambda y i o (type y Number))))))
       (map (lambda x i o (do x 
                (push (get policy i)) 
                (push (get inputs i)))))
       (map (lambda x i o 
        (push x (solve2 (conjugate (get x 3)) (get x 2) (get x 0) (get x 1)))
       ))
       (reduce (lambda a x i o (+ a (get x -1))) 0)
    ))`,

      `(defvar array (Array 5 length))
    (set array -1)
    (length array)`,
      `(defvar array (Array 5 length))
    (set array -4)
    (length array)`,
      `(defvar array (Array 5 length))
    (set array -5)
    (length array)`,
      `(defun push array value (set array (length array) value))
    (defun concat array1 array2 (block
    (loop iterate i bounds (block
    (if (< i (length array2)) (push array1 (get array2 i)))
    (if (< i bounds) 
      (iterate (+ i 1) bounds)
    array1
    )))
    (iterate 0 (- (length array2) 1))))
    (defun sort arr (block
      (if (<= (length arr) 1) arr
      (block
        (defvar pivot (get arr 0))
        (defvar left-arr ())
        (defvar right-arr ())
    (loop iterate i bounds (block
        (defvar current (get arr i))
        (if (< current pivot) 
            (push left-arr current)
            (push right-arr current))
        (if (< i bounds) (iterate (+ i 1) bounds))))
        (iterate 1 (- (length arr) 1))
    (do 
      left-arr (sort) 
      (push pivot) 
      (concat (sort right-arr)))
    ))))
    
    (defun reverse array (block
    (defvar len (length array))
    (defvar reversed (Array len length))
    (defvar offset (- len 1))
    (loop iterate i bounds (block
      (set reversed (- offset i) (get array i))
      (if (< i bounds) (iterate (+ i 1) bounds) reversed)))
    (iterate 0 offset)))
    (do
      (Array 1 0 8 -2 3)
      (sort)
      (reverse))`,

      `(defvar find (lambda array callback (block
    (loop interate i bounds (block
      (defvar current (get array i))
      (if (and (not (callback current i)) (< i bounds))
        (interate (+ i 1) bounds) 
        current)))
        (interate 0 (- (length array) 1)))))
  (find (Array 1 2 3 4 5 6) (lambda x i (= i 2)))`,
      `(defvar push (lambda array value (set array (length array) value)))
  (defvar for-each (lambda array callback (block 
    (loop interate i bounds (block
      (callback (get array i) i)
      (if (< i bounds) (interate (+ i 1) bounds) array)))
    (interate 0 (- (length array) 1)))))
    (defvar deep-flat (lambda arr (block 
      (defvar new-array ()) 
      (defvar flatten (lambda item (if (Arrayp item) (for-each item (lambda x _ (flatten x))) 
      (push new-array item))))
      new-array
    )))
  (defvar arr (
  Array 
  (Array 1 2) 
  (Array 1 2) 
  (Array 1 3) 
  (Array 1 (Array 4 4 (Array "x" "y"))) 
  (Array 1 2))
)
(deep-flat arr)`,
      `(loop interate i (if (< i 100) 
  (interate (+ i 1)) i))
(interate 0)
`,
      `(defvar push (lambda array value (set array (length array) value)))
    (defvar concat (lambda array1 array2 (block
      (defvar interate (lambda i bounds (block
      (push array1 (get array2 i))
      (if (< i bounds) 
        (interate (+ i 1) bounds)
      array1
      ))))
    (interate 0 (- (length array2) 1)))))
  
    (do
      (Array 1 2 3)
      (push -1)
      (concat (conjugate "abc"))
      (concat (Array 1 2 3 4))
      (concat (Array 5 6 7))
    )`,

      `(do 1 
      (+ 2) 
        (* 3 4)
         (- 3 2))`,
      `(defvar sample 
      "1721
      979
      366
      299
      675
      1456")
      
      (defvar push (lambda array value (set array (length array) value)))
      
      (defvar max (lambda a b (if (> a b) a b)))
      (defvar min (lambda a b (if (< a b) a b)))
      
      (defvar map (lambda array callback (block 
      (defvar new-array ())
      (defvar i 0)
      (defvar interate (lambda i bounds (block
        (set new-array i (callback (get array i) i))
        (if (< i bounds) (interate (+ i 1) bounds) new-array)
      )))
      (interate 0 (- (length array) 1)))))
      
      (defvar reduce (lambda array callback initial (block
        (defvar interate (lambda i bounds (block
          (setf initial (callback initial (get array i) i))
          (if (< i bounds) (interate (+ i 1) bounds) initial))))
      (interate 0 (- (length array) 1)))))
      (defvar join (lambda array delim (reduce array (lambda a x i (concatenate a delim x)) "")))
      (defvar string_to_array (lambda string delim 
      (reduce (conjugate string) (lambda a x i (block
          (if (= x delim) 
            (push a ()) 
            (block (push (get a -1) x) a)
          )))(push () ()))))
      
       (defvar split-by-lines (lambda string (map (string_to_array string "\n") (lambda x i (join x "")))))
       
       (map (map 
        (split-by-lines sample) 
          (lambda x i (type x Number))) 
          (lambda x i (- 2020 x)))
    `,
      `(defvar range (lambda start end (block
      (defvar array ())
      (defvar interate (lambda i bounds (block
        (set array i (+ i start))
        (if (< i bounds) (interate (+ i 1) bounds) array)
      )))
      (interate 0 (- end start)))))
      
      
      (defvar map (lambda array callback (block 
      (defvar new-array ())
      (defvar i 0)
      (defvar interate (lambda i bounds (block
        (set new-array i (callback (get array i) i))
        (if (< i bounds) (interate (+ i 1) bounds) new-array)
      )))
      (interate 0 (- (length array) 1)))))
      
      
      (defvar remove (lambda array callback (block
      (defvar new-array ())
      (defvar interate (lambda i bounds (block
        (defvar current (get array i))
        (if (callback current i) 
          (set new-array (length new-array) current))
        (if (< i bounds) (interate (+ i 1) bounds) new-array)
      )))
      (interate 0 (- (length array) 1)))))
      
      (defvar reduce (lambda array callback initial (block
        (defvar interate (lambda i bounds (block
          (setf initial (callback initial (get array i) i))
          (if (< i bounds) (interate (+ i 1) bounds) initial)
        )))
      (interate 0 (- (length array) 1)))))
      

(defvar is-odd (lambda x i (= (mod x 2) 1)))
(defvar mult_2 (lambda x i (* x 2)))
(defvar sum (lambda a x i (+ a x)))

(do 
(Array 1 2 3 4 5 6 7 101) 
(remove is-odd)
(map mult_2)
(reduce sum 0))
      `,

      `(defvar range (lambda start end (block
        (defvar array ())
        (loop interate i bounds (block
          (set array i (+ i start))
          (if (< i bounds) (interate (+ i 1) bounds) array)))
        (interate 0 (- end start)))))
        
        
        (defvar map (lambda array callback (block 
        (defvar new-array ())
        (defvar i 0)
        (loop interate i bounds (block
          (set new-array i (callback (get array i) i))
          (if (< i bounds) (interate (+ i 1) bounds) new-array)))
        (interate 0 (- (length array) 1)))))
        
        
        (defvar remove (lambda array callback (block 
        (defvar new-array ())
        (loop interate i bounds (block
          (defvar current (get array i))
          (if (callback current i) 
            (set new-array (length new-array) current))
          (if (< i bounds) (interate (+ i 1) bounds) new-array)))
        (interate 0 (- (length array) 1)))))
        
        (defvar reduce (lambda array callback initial (block
          (loop interate i bounds (block
            (setf initial (callback initial (get array i) i))
            (if (< i bounds) (interate (+ i 1) bounds) initial)))
        (interate 0 (- (length array) 1)))))
        
  
  (defvar is-odd (lambda x i (= (mod x 2) 1)))
  (defvar mult_2 (lambda x i (* x 2)))
  (defvar sum (lambda a x i (+ a x)))
  
  (do 
    (Array 1 2 3 4 5 6 7 101) 
    (remove is-odd)
    (map mult_2)
    (reduce sum 0)
  )
  `,
    ].forEach((source) =>
      deepStrictEqual(runFromInterpreted(source), runFromCompiled(source))
    ))
})
