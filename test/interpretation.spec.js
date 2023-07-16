import { deepStrictEqual, strictEqual } from 'assert'
import { runFromInterpreted } from '../src/utils.js'
describe('Interpration', () => {
  it('Should be correct', () => {
    strictEqual(
      runFromInterpreted(`(defvar x 8)
  (or (cond 
  (= x 10) "Ten"
  (= x 9) "Nine"
  (= x 8) "Eight") "NaN")`),
      'Eight'
    )
    deepStrictEqual(
      runFromInterpreted(`
  (defun floor n (| n 0)) (defun round n (| (+ n 0.5) 0))
  (Array (round 1.5) (floor 1.5) (round 1.2) (floor 1.2) (round 1.7) (floor 1.7))
  `),
      [
        Math.round(1.5),
        Math.floor(1.5),
        Math.round(1.2),
        Math.floor(1.2),
        Math.round(1.7),
        Math.floor(1.7),
      ]
    )
    strictEqual(
      runFromInterpreted(`(defvar T (lambda x (lambda y (lambda (* 5 x y)))))
  (apply (apply (apply T 10) 3))`),
      150
    )
    deepStrictEqual(
      runFromInterpreted(`
    (defvar bol (Boolean))
    (Array bol (boole bol 1) (boole bol 0) (boole bol 1) (boole bol 0))
  `),
      [1, 1, 0, 1, 0]
    )
    deepStrictEqual(
      runFromInterpreted(`
    (defun some array callback (do
      (defvar bol 1)
      (loop defun iterate i bounds (do
        (defvar res (callback (get array i) i array))
        (boole bol (type res Boolean))
        (if (and (not res) (< i bounds)) (iterate (+ i 1) bounds) bol)))
      (iterate 0 (- (length array) 1))))
        (defun equal a b 
     (or (and (atom a) (atom b) (= a b)) 
     (and (Arrayp a) 
          (= (length a) (length b)) 
            (not (some a (lambda . i . (not (equal (get a i) (get b i)))))))))
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
    (equal (Array 1 2 (Array 1 2)) (Array 1 2 (Array 1 2)))))`),
      [1, 0, [1, 0, 1, 0, 0, 0, 1]]
    )

    deepStrictEqual(
      runFromInterpreted(
        `(defun is-array-of-atoms array 
        (if (not (length array)) 1 
         (if (atom (car array)) 
          (is-array-of-atoms (cdr array)) 0)))
     
           (Array 
               (is-array-of-atoms (Array 1 2 (Array 1 2) "5"))
               (is-array-of-atoms (Array 1 2 3 4 "5")))`
      ),
      [0, 1]
    )
    strictEqual(
      runFromInterpreted(
        `(trace (Array (Array 1 2 3 4 5) 2 3 4) (car) (cdr) (car))`
      ),
      2
    )
    deepStrictEqual(runFromInterpreted(`(cdr (Array 1 2 3 4))`), [2, 3, 4])
    strictEqual(runFromInterpreted(`(car (Array 1 2 3 4))`), 1)
    strictEqual(
      runFromInterpreted(`(trace 1 
    (+ 2) 
      (* 3 4)
       (- 3 2))`),
      31
    )
    strictEqual(runFromInterpreted(`(defvar x -1) (trace x (-))`), 1)
    strictEqual(runFromInterpreted(`(defvar x -1) (- x)`), 1)
    strictEqual(runFromInterpreted(`(- 1)`), -1)
    strictEqual(runFromInterpreted(`(if (< 1 2) 42 69)`), 42)
    strictEqual(runFromInterpreted(`(unless (< 1 2) 42 69)`), 69)
    deepStrictEqual(
      runFromInterpreted(`
(defun min a b (if (< a b) a b))
(defun push array value (set array (length array) value))
(defun euclidean-mod a b (mod (+ (mod a b) b) b))
(defun find array callback (do
  (loop defun iterate i bounds (do
    (defvar current (get array i))
    (if (and (not (callback current i array)) (< i bounds))
      (iterate (+ i 1) bounds) 
      current)))
      (iterate 0 (- (length array) 1))))
(defun find-index array callback (do
  (defvar idx -1)
  (defvar has-found 0)
  (loop defun iterate i bounds (do
    (defvar current (get array i))
    (setf has-found (callback current i array))
    (if (and (not has-found) (< i bounds))
      (iterate (+ i 1) bounds) 
      (setf idx i))))
      (iterate 0 (- (length array) 1))
      (if has-found idx -1)))
(defun array-in-bounds-p array index (and (< index (length array)) (>= index 0)))
(defun map array callback (do 
  (defvar new-array ())
  (defvar i 0)
  (loop defun iterate i bounds (do
    (set new-array i (callback (get array i) i array))
    (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
  (iterate 0 (- (length array) 1))))
    (defun hash-index 
      table key 
        (do
          (defvar total 0)
          (defvar prime-num 31)
          (defvar key-arr (type (type key String) Array))
          (loop defun find-hash-index i bounds (do 
            (defvar letter (get key-arr i))
            (defvar value (- (char letter 0) 96))
            (setf total (euclidean-mod (+ (* total prime-num) value) (length table)))
            (if (< i bounds) (find-hash-index (+ i 1) bounds) total)))
          (find-hash-index 0 (min (- (length key-arr) 1) 100))))
      ; hash-table-set
    (defun hash-table-set 
      table key value 
        (do
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
        (do
          (defvar idx (hash-index table key))
          (if (array-in-bounds-p table idx) 
            (do
              (defvar current (get table idx))
              (trace current
                (find (lambda x i o (= key 
                        (trace x (get 0)))))
                (get 1))))))
    (defun hash-table 
      size 
        (map (Array size length) (lambda x i o ())))
    (defun hash-table-make 
      items 
        (do
          (defvar len (- (length items) 1))
          (defvar table (hash-table (* len len)))
          (loop defun add i (do
            (defvar item (get items i))
            (hash-table-set table (get item 0) (get item 1))
          (if (< i len) (add (+ i 1)) table)))
          (add 0)))
    
    (defvar tabl  (trace
    (hash-table-make (Array 
      (Array "name" "Anthony") 
      (Array "age" 32) 
      (Array "skills" 
        (Array "Animation" "Programming"))))
  )) (hash-table-set tabl "age" 33)`),
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
    (defun binary-tree-node 
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
  (trace 
    (binary-tree-node 1)
    (binary-tree-set-left 
          (trace 
            (binary-tree-node 2) 
            (binary-tree-set-left 
              (trace (binary-tree-node 4) 
                  (binary-tree-set-right 
                  (binary-tree-node 5))))))
    (binary-tree-set-right (binary-tree-node 3))
    (binary-tree-get-left)
    (binary-tree-get-left)
    (binary-tree-get-right))
  binary-tree-node`),
      [
        ['value', 5],
        ['left', []],
        ['right', []],
      ]
    )
    strictEqual(
      runFromInterpreted(`(defvar add_seq (lambda x (+ x 1 2 3)))
  (defun mult_10 x (* x 10))
  (defvar do_thing (lambda (trace 100 
                        (add_seq) 
                        (mult_10))))
  (do_thing)`),
      1060
    )
    deepStrictEqual(
      runFromInterpreted(`
    (defun floor n (| n 0))
(defun push array value (set array (length array) value))
(defun array-of-numbers array (map array (lambda x i (type x Number))))
(defun product-array array (reduce array (lambda a b i o (* a b)) 1))
(defun split-by-lines string (regex-match string "[^\n]+"))
(defun string_to_array string delim 
                      (reduce (type string Array) 
                        (lambda a x i o (do
                                  (if (= x delim) (push a ()) (do 
                                    (push (get a -1) x) a))))(push () ())))
(defun join array delim (reduce array (lambda a x i o (concatenate a delim x)) ""))

(defun concat array1 array2 (do
  (loop defun iterate i bounds (do
  (if (< i (length array2)) (push array1 (get array2 i)))
  (if (< i bounds) 
    (iterate (+ i 1) bounds)
  array1)))
(iterate 0 (- (length array2) 1))))

(defun map array callback (do 
  (defvar new-array ())
  (defvar i 0)
  (loop defun iterate i bounds (do
    (set new-array i (callback (get array i) i))
    (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
  (iterate 0 (- (length array) 1))))

(defun reduce array callback initial (do
  (loop defun iterate i bounds (do
    (setf initial (callback initial (get array i) i array))
    (if (< i bounds) (iterate (+ i 1) bounds) initial)))
  (iterate 0 (- (length array) 1))))

(defun quick-sort arr (do
  (if (<= (length arr) 1) arr
  (do
    (defvar pivot (get arr 0))
    (defvar left-arr ())
    (defvar right-arr ())
(loop defun iterate i bounds (do
    (defvar current (get arr i))
    (if (< current pivot) 
        (push left-arr current)
        (push right-arr current))
    (if (< i bounds) (iterate (+ i 1) bounds))))
    (iterate 1 (- (length arr) 1))
(trace 
  left-arr (quick-sort) 
  (push pivot) 
  (concat (quick-sort right-arr)))))))

(defun binary-search 
        array target (do
  (loop defun search 
        arr target start end (do
    (if (<= start end) (do 
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
     (reduce array (lambda a x i array (do
        (defvar res (binary-search array (cb x)))
        (if res (push a res) a))) 
     ()))

(defun solve2 array cb 
    (reduce array
      (lambda accumulator y i array (do
          (loop defun iterate j bounds (do 
              (defvar x (get array j))
              (defvar res (binary-search array (cb x y)))
              (if res (push accumulator res))
            (if (< j bounds) (iterate (+ j 1) bounds)
        accumulator)))
        (iterate i (- (length array) 1)))) 
     ()))


(Array
  (trace input
  (split-by-lines)
  (array-of-numbers)
  (quick-sort)
  (solve1 (lambda x (- 2020 x)))
  (product-array))
(trace input
  (split-by-lines)
  (array-of-numbers)
  (quick-sort)
  (solve2 (lambda x y (- 2020 x y)))
  (product-array)))
    `),
      [514579, 241861950]
    )

    strictEqual(
      runFromInterpreted(`
  (defvar array (Array 5 length))
  (set array -5)
  (length array)
`),
      0
    )
    deepStrictEqual(
      runFromInterpreted(`
    (defun push array value (set array (length array) value))
    (defun concat array1 array2 (do
      (loop defun iterate i bounds (do
      (if (< i (length array2)) (push array1 (get array2 i)))
      (if (< i bounds) 
        (iterate (+ i 1) bounds)
      array1
      )))
    (iterate 0 (- (length array2) 1))))
    (defun quick-sort arr (do
      (if (<= (length arr) 1) arr
      (do
        (defvar pivot (get arr 0))
        (defvar left-arr ())
        (defvar right-arr ())
    (loop defun iterate i bounds (do
        (defvar current (get arr i))
        (if (< current pivot) 
            (push left-arr current)
            (push right-arr current))
        (if (< i bounds) (iterate (+ i 1) bounds))))
        (iterate 1 (- (length arr) 1))
    (trace 
      left-arr (quick-sort) 
      (push pivot) 
      (concat (quick-sort right-arr)))))))
    (defun reverse array (do
      (defvar len (length array))
      (defvar reversed (Array len length))
      (defvar offset (- len 1))
      (loop defun iterate i bounds (do
        (set reversed (- offset i) (get array i))
        (if (< i bounds) (iterate (+ i 1) bounds) reversed)))
      (iterate 0 offset)
      ))
    
      (trace
        (Array 1 0 8 -2 3)
        (quick-sort)
        (reverse))
    `),
      [8, 3, 1, 0, -2]
    )
    strictEqual(
      runFromInterpreted(`(defvar find (lambda array callback (do
      (loop defun iterate i bounds (do
        (defvar current (get array i))
        (if (and (not (callback current i)) (< i bounds))
          (iterate (+ i 1) bounds) 
          current)))
          (iterate 0 (- (length array) 1)))))
    (find (Array 1 2 3 4 5 6) (lambda x i (= i 2)))`),
      3
    )
    deepStrictEqual(
      runFromInterpreted(`
    (defvar push (lambda array value (set array (length array) value)))
    (defvar for-each (lambda array callback (do
      (loop defun iterate i bounds (do
        (callback (get array i) i)
        (if (< i bounds) (iterate (+ i 1) bounds) array)))
      (iterate 0 (- (length array) 1)))))
    (defvar deep-flat (lambda arr (do 
      (defvar new-array ()) 
      (loop defun flatten item (if (Arrayp item) (for-each item (lambda x . (flatten x))) 
      (push new-array item)))
      (flatten arr) 
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
  (deep-flat arr)`),
      [1, 2, 1, 2, 1, 3, 1, 4, 4, 'x', 'y', 1, 2]
    )
    strictEqual(
      runFromInterpreted(`(loop defun iterate i (if (< i 100) 
  (iterate (+ i 1)) i))
(iterate 0)
`),
      100
    )
    deepStrictEqual(
      runFromInterpreted(`(defvar push (lambda array value (set array (length array) value)))
  (defvar concat (lambda array1 array2 (do
    (defvar iterate (lambda i bounds (do
    (push array1 (get array2 i))
    (if (< i bounds) 
      (iterate (+ i 1) bounds)
    array1
    ))))
  (iterate 0 (- (length array2) 1)))))

  (trace
    (Array 1 2 3)
    (push -1)
    (concat (type "abc" Array))
    (concat (Array 1 2 3 4))
    (concat (Array 5 6 7))
  )`),
      [1, 2, 3, -1, 'a', 'b', 'c', 1, 2, 3, 4, 5, 6, 7]
    )
    strictEqual(
      runFromInterpreted(`(defvar range (lambda start end (do 
  (defvar array ())
  (defvar iterate (lambda i bounds (do
    (set array i (+ i start))
    (if (< i bounds) (iterate (+ i 1) bounds) array)
  )))
  (iterate 0 (- end start)))))
  
  
  (defvar map (lambda array callback (do 
  (defvar new-array ())
  (defvar i 0)
  (defvar iterate (lambda i bounds (do
    (set new-array i (callback (get array i) i))
    (if (< i bounds) (iterate (+ i 1) bounds) new-array)
  )))
  (iterate 0 (- (length array) 1)))))
  
  
  (defvar remove (lambda array callback (do 
  (defvar new-array ())
  (defvar iterate (lambda i bounds (do
    (defvar current (get array i))
    (if (callback current i) 
      (set new-array (length new-array) current))
    (if (< i bounds) (iterate (+ i 1) bounds) new-array)
  )))
  (iterate 0 (- (length array) 1)))))
  
  (defvar reduce (lambda array callback initial (do
    (defvar iterate (lambda i bounds (do
      (setf initial (callback initial (get array i) i))
      (if (< i bounds) (iterate (+ i 1) bounds) initial)
    )))
  (iterate 0 (- (length array) 1)))))
  

  (defvar is-odd (lambda x i (= (mod x 2) 1)))
  (defvar mult_2 (lambda x i (* x 2)))
  (defvar sum (lambda a x i (+ a x)))
  
  (trace 
  (Array 1 2 3 4 5 6 7 101) 
  (remove is-odd)
  (map mult_2)
  (reduce sum 0))
  
  `),
      234
    )

    deepStrictEqual(
      runFromInterpreted(`
  (defvar sample 
    "1721
    979
    366
    299
    675
    1456")
    
    (defvar push (lambda array value (set array (length array) value)))
    
    (defvar max (lambda a b (if (> a b) a b)))
    (defvar min (lambda a b (if (< a b) a b)))
    
    (defvar map (lambda array callback (do 
    (defvar new-array ())
    (defvar i 0)
    (defvar iterate (lambda i bounds (do
      (set new-array i (callback (get array i) i))
      (if (< i bounds) (iterate (+ i 1) bounds) new-array)
    )))
    (iterate 0 (- (length array) 1)))))
    
    (defvar reduce (lambda array callback initial (do
      (defvar iterate (lambda i bounds (do
        (setf initial (callback initial (get array i) i))
        (if (< i bounds) (iterate (+ i 1) bounds) initial))))
    (iterate 0 (- (length array) 1)))))
    (defvar join (lambda array delim (reduce array (lambda a x i (concatenate a delim x)) "")))
    (defvar string_to_array (lambda string delim 
    (reduce (type string Array) (lambda a x i (do
        (if (= x delim) 
          (push a ()) 
          (do (push (get a -1) x) a)
        )))(push () ()))))
    
     (defvar split-by-lines (lambda string (map (string_to_array string "\n") (lambda x i (join x "")))))
     
     (map (map 
      (split-by-lines sample) 
        (lambda x i (type x Number))) 
        (lambda x i (- 2020 x)))
  `),
      [299, 1041, 1654, 1721, 1345, 564]
    )
  })
})
