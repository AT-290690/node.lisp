import { deepStrictEqual } from 'assert'
import { runFromCompiled, runFromInterpreted } from '../src/utils.js'
it('compilation should work', () =>
  [
    `(:= find (lambda array callback (block
    (loop interate i bounds (block
      (:= current (get array i))
      (if (and (not (callback current i)) (< i bounds))
        (interate (+ i 1) bounds) 
        current)))
        (interate 0 (- (length array) 1)))))
  (find (' 1 2 3 4 5 6) (lambda x i (eq i 2)))`,
    `(:= push (lambda array value (set array (length array) value)))
  (:= for_each (lambda array callback (block 
    (loop interate i bounds (block
      (callback (get array i) i)
      (if (< i bounds) (interate (+ i 1) bounds) array)))
    (interate 0 (- (length array) 1)))))
  (:= deep_flat (lambda arr (block 
    (:= new_array (Array 0)) 
    (loop flatten item (if (Arrayp item) (for_each item (lambda x _ (flatten x))) 
    (push new_array item)))
    (flatten arr) 
    new_array
  )))
  (:= arr (
  Array 
  (Array 1 2) 
  (Array 1 2) 
  (Array 1 3) 
  (Array 1 (Array 4 4 (Array "x" "y"))) 
  (Array 1 2))
)
(deep_flat arr)`,
    `(loop interate i (if (< i 100) 
  (interate (+ i 1)) i))
(interate 0)
`,
    `(:= push (lambda array value (set array (length array) value)))
    (:= concat (lambda array1 array2 (block
      (:= interate (lambda i bounds (block
      (push array1 (get array2 i))
      (if (< i bounds) 
        (interate (+ i 1) bounds)
      array1
      ))))
    (interate 0 (- (length array2) 1)))))
  
    (do
      (Array 1 2 3)
      (push -1)
      (concat (... "abc"))
      (concat (Array 1 2 3 4))
      (concat (Array 5 6 7))
    )`,

    `(do 1 
      (+ 2) 
        (* 3 4)
         (- 3 2))`,
    `(:= sample 
      "1721
      979
      366
      299
      675
      1456")
      
      (:= push (lambda array value (set array (length array) value)))
      
      (:= max (lambda a b (if (> a b) a b)))
      (:= min (lambda a b (if (< a b) a b)))
      
      (:= map (lambda array callback (block 
      (:= new_array (Array 0))
      (:= i 0)
      (:= interate (lambda i bounds (block
        (set new_array i (callback (get array i) i))
        (if (< i bounds) (interate (+ i 1) bounds) new_array)
      )))
      (interate 0 (- (length array) 1)))))
      
      (:= reduce (lambda array callback initial (block
        (:= interate (lambda i bounds (block
          (= initial (callback initial (get array i) i))
          (if (< i bounds) (interate (+ i 1) bounds) initial))))
      (interate 0 (- (length array) 1)))))
      (:= join (lambda array delim (reduce array (lambda a x i (++ a delim x)) "")))
      (:= string_to_array (lambda string delim 
      (reduce (... string) (lambda a x i (block
          (if (eq x delim) 
            (push a (Array 0)) 
            (block (push (get a -1) x) a)
          )))(push (Array 0) (Array 0)))))
      
       (:= split_by_lines (lambda string (map (string_to_array string (esc "n")) (lambda x i (join x "")))))
       
       (map (map 
        (split_by_lines sample) 
          (lambda x i (\` (x)))) 
          (lambda x i (- 2020 x)))
    `,
    `(:= range (lambda start end (block
      (:= array (Array 0))
      (:= interate (lambda i bounds (block
        (set array i (+ i start))
        (if (< i bounds) (interate (+ i 1) bounds) array)
      )))
      (interate 0 (- end start)))))
      
      
      (:= map (lambda array callback (block 
      (:= new_array (Array 0))
      (:= i 0)
      (:= interate (lambda i bounds (block
        (set new_array i (callback (get array i) i))
        (if (< i bounds) (interate (+ i 1) bounds) new_array)
      )))
      (interate 0 (- (length array) 1)))))
      
      
      (:= filter (lambda array callback (block
      (:= new_array (Array 0))
      (:= i 0)
      (:= interate (lambda i bounds (block
        (:= current (get array i))
        (if (callback current i) 
          (set new_array (length new_array) current))
        (if (< i bounds) (interate (+ i 1) bounds) new_array)
      )))
      (interate 0 (- (length array) 1)))))
      
      (:= reduce (lambda array callback initial (block
        (:= interate (lambda i bounds (block
          (= initial (callback initial (get array i) i))
          (if (< i bounds) (interate (+ i 1) bounds) initial)
        )))
      (interate 0 (- (length array) 1)))))
      

(:= is_odd (lambda x i (eq (mod x 2) 1)))
(:= mult_2 (lambda x i (* x 2)))
(:= sum (lambda a x i (+ a x)))

(do 
(Array 1 2 3 4 5 6 7 101) 
(filter is_odd)
(map mult_2)
(reduce sum 0))
      `,

    `(:= range (lambda start end (block
        (:= array (Array 0))
        (loop interate i bounds (block
          (set array i (+ i start))
          (if (< i bounds) (interate (+ i 1) bounds) array)))
        (interate 0 (- end start)))))
        
        
        (:= map (lambda array callback (block 
        (:= new_array (Array 0))
        (:= i 0)
        (loop interate i bounds (block
          (set new_array i (callback (get array i) i))
          (if (< i bounds) (interate (+ i 1) bounds) new_array)))
        (interate 0 (- (length array) 1)))))
        
        
        (:= filter (lambda array callback (block 
        (:= new_array (Array 0))
        (:= i 0)
        (loop interate i bounds (block
          (:= current (get array i))
          (if (callback current i) 
            (set new_array (length new_array) current))
          (if (< i bounds) (interate (+ i 1) bounds) new_array)))
        (interate 0 (- (length array) 1)))))
        
        (:= reduce (lambda array callback initial (block
          (loop interate i bounds (block
            (= initial (callback initial (get array i) i))
            (if (< i bounds) (interate (+ i 1) bounds) initial)))
        (interate 0 (- (length array) 1)))))
        
  
  (:= is_odd (lambda x i (eq (mod x 2) 1)))
  (:= mult_2 (lambda x i (* x 2)))
  (:= sum (lambda a x i (+ a x)))
  
  (do 
    (Array 1 2 3 4 5 6 7 101) 
    (filter is_odd)
    (map mult_2)
    (reduce sum 0)
  )
  `,
  ].forEach((source) =>
    deepStrictEqual(runFromInterpreted(source), runFromCompiled(source))
  ))
