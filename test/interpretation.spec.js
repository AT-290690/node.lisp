import { deepStrictEqual, strictEqual } from 'assert'
import { runFromInterpreted } from '../src/utils.js'
it('interpretation should work', () => {
  strictEqual(
    runFromInterpreted(`(:= find (lambda array callback (block
      (loop iterate i bounds (block
        (:= current (get array i))
        (if (and (not (callback current i)) (< i bounds))
          (iterate (+ i 1) bounds) 
          current)))
          (iterate 0 (- (length array) 1)))))
    (find (' 1 2 3 4 5 6) (lambda x i (eq i 2)))`),
    3
  )
  deepStrictEqual(
    runFromInterpreted(`
    (:= push (lambda array value (set array (length array) value)))
    (:= for_each (lambda array callback (block
      (loop iterate i bounds (block
        (callback (get array i) i)
        (if (< i bounds) (iterate (+ i 1) bounds) array)))
      (iterate 0 (- (length array) 1)))))
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
    runFromInterpreted(`(:= push (lambda array value (set array (length array) value)))
  (:= concat (lambda array1 array2 (block
    (:= iterate (lambda i bounds (block
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
    runFromInterpreted(`(:= range (lambda start end (block 
  (:= array (Array 0))
  (:= iterate (lambda i bounds (block
    (set array i (+ i start))
    (if (< i bounds) (iterate (+ i 1) bounds) array)
  )))
  (iterate 0 (- end start)))))
  
  
  (:= map (lambda array callback (block 
  (:= new_array (Array 0))
  (:= i 0)
  (:= iterate (lambda i bounds (block
    (set new_array i (callback (get array i) i))
    (if (< i bounds) (iterate (+ i 1) bounds) new_array)
  )))
  (iterate 0 (- (length array) 1)))))
  
  
  (:= filter (lambda array callback (block 
  (:= new_array (Array 0))
  (:= i 0)
  (:= iterate (lambda i bounds (block
    (:= current (get array i))
    (if (callback current i) 
      (set new_array (length new_array) current))
    (if (< i bounds) (iterate (+ i 1) bounds) new_array)
  )))
  (iterate 0 (- (length array) 1)))))
  
  (:= reduce (lambda array callback initial (block
    (:= iterate (lambda i bounds (block
      (= initial (callback initial (get array i) i))
      (if (< i bounds) (iterate (+ i 1) bounds) initial)
    )))
  (iterate 0 (- (length array) 1)))))
  

  (:= is_odd (lambda x i (eq (mod x 2) 1)))
  (:= mult_2 (lambda x i (* x 2)))
  (:= sum (lambda a x i (+ a x)))
  
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
  (:= sample 
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
    (:= iterate (lambda i bounds (block
      (set new_array i (callback (get array i) i))
      (if (< i bounds) (iterate (+ i 1) bounds) new_array)
    )))
    (iterate 0 (- (length array) 1)))))
    
    (:= reduce (lambda array callback initial (block
      (:= iterate (lambda i bounds (block
        (= initial (callback initial (get array i) i))
        (if (< i bounds) (iterate (+ i 1) bounds) initial))))
    (iterate 0 (- (length array) 1)))))
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
