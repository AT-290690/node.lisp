import { deepStrictEqual, strictEqual } from 'assert'
import { runFromInterpreted } from '../src/utils.js'
it('interpretation should work', () => {
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
(function sort arr (block
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
(if (and (length left_arr) (length right_arr)))
(let left (sort left_arr))
(let right (sort right_arr))
(concat (push left pivot) right)))))
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
    (' 1 0 8 -2 3)
    (sort)
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
    (find (' 1 2 3 4 5 6) (lambda x i (eq i 2)))`),
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
      (= initial (callback initial (get array i) i))
      (if (< i bounds) (iterate (+ i 1) bounds) initial)
    )))
  (iterate 0 (- (length array) 1)))))
  

  (let is_odd (lambda x i (eq (mod x 2) 1)))
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
        (= initial (callback initial (get array i) i))
        (if (< i bounds) (iterate (+ i 1) bounds) initial))))
    (iterate 0 (- (length array) 1)))))
    (let join (lambda array delim (reduce array (lambda a x i (concatenate a delim x)) "")))
    (let string_to_array (lambda string delim 
    (reduce (... string) (lambda a x i (block
        (if (eq x delim) 
          (push a (Array 0)) 
          (block (push (get a -1) x) a)
        )))(push (Array 0) (Array 0)))))
    
     (let split_by_lines (lambda string (map (string_to_array string (esc "n")) (lambda x i (join x "")))))
     
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
