import { throws, strictEqual, deepStrictEqual } from 'assert'
import { runFromCompiled, runFromInterpreted } from '../src/utils.js'
it('compilation should work', () =>
  [
    `
  (:= push (-> array value (.= array (.. array) value)))
  (:= for_each (-> array callback (: 
    (~= loop i bounds (:
      (callback (. array i) i)
      (? (< i bounds) (loop (+ i 1) bounds) array)))
    (loop 0 (- (.. array) 1)))))
  (:= deep_flat (-> arr (: 
    (:= new_array ([] 0)) 
    (~= flatten item (? ([?] item) (for_each item (-> x _ (flatten x))) 
    (push new_array item)))
    (flatten arr) 
    new_array
  )))
  (:= arr (
  [] 
  ([] 1 2) 
  ([] 1 2) 
  ([] 1 3) 
  ([] 1 ([] 4 4 ([] "x" "y"))) 
  ([] 1 2))
)
(deep_flat arr)`,
    `(~= loop i (? (< i 100) 
  (loop (+ i 1)) i))
(loop 0)
`,
    `(:= push (-> array value (.= array (.. array) value)))
    (:= concat (-> array1 array2 (:
      (:= loop (-> i bounds (:
      (push array1 (. array2 i))
      (? (< i bounds) 
        (loop (+ i 1) bounds)
      array1
      ))))
    (loop 0 (- (.. array2) 1)))))
  
    (|>
      ([] 1 2 3)
      (push -1)
      (concat (... "abc"))
      (concat ([] 1 2 3 4))
      (concat ([] 5 6 7))
    )`,

    `(|> 1 
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
      
      (:= push (-> array value (.= array (.. array) value)))
      
      (:= max (-> a b (? (> a b) a b)))
      (:= min (-> a b (? (< a b) a b)))
      
      (:= map (-> array callback (: 
      (:= new_array ([] 0))
      (:= i 0)
      (:= loop (-> i bounds (:
        (.= new_array i (callback (. array i) i))
        (? (< i bounds) (loop (+ i 1) bounds) new_array)
      )))
      (loop 0 (- (.. array) 1)))))
      
      (:= reduce (-> array callback initial (:
        (:= loop (-> i bounds (:
          (= initial (callback initial (. array i) i))
          (? (< i bounds) (loop (+ i 1) bounds) initial))))
      (loop 0 (- (.. array) 1)))))
      (:= join (-> array delim (reduce array (-> a x i (++ a delim x)) "")))
      (:= string_to_array (-> string delim 
      (reduce (... string) (-> a x i (:
          (? (== x delim) 
            (push a ([] 0)) 
            (: (push (. a -1) x) a)
          )))(push ([] 0) ([] 0)))))
      
       (:= split_by_lines (-> string (map (string_to_array string (esc "n")) (-> x i (join x "")))))
       
       (map (map 
        (split_by_lines sample) 
          (-> x i (\` (x)))) 
          (-> x i (- 2020 x)))
    `,
    `(:= range (-> start end (: 
      (:= array ([] 0))
      (:= loop (-> i bounds (:
        (.= array i (+ i start))
        (? (< i bounds) (loop (+ i 1) bounds) array)
      )))
      (loop 0 (- end start)))))
      
      
      (:= map (-> array callback (: 
      (:= new_array ([] 0))
      (:= i 0)
      (:= loop (-> i bounds (:
        (.= new_array i (callback (. array i) i))
        (? (< i bounds) (loop (+ i 1) bounds) new_array)
      )))
      (loop 0 (- (.. array) 1)))))
      
      
      (:= filter (-> array callback (: 
      (:= new_array ([] 0))
      (:= i 0)
      (:= loop (-> i bounds (:
        (:= current (. array i))
        (? (callback current i) 
          (.= new_array (.. new_array) current))
        (? (< i bounds) (loop (+ i 1) bounds) new_array)
      )))
      (loop 0 (- (.. array) 1)))))
      
      (:= reduce (-> array callback initial (:
        (:= loop (-> i bounds (:
          (= initial (callback initial (. array i) i))
          (? (< i bounds) (loop (+ i 1) bounds) initial)
        )))
      (loop 0 (- (.. array) 1)))))
      

(:= is_odd (-> x i (== (% x 2) 1)))
(:= mult_2 (-> x i (* x 2)))
(:= sum (-> a x i (+ a x)))

(|> 
([] 1 2 3 4 5 6 7 101) 
(filter is_odd)
(map mult_2)
(reduce sum 0))
      `,

    `(:= range (-> start end (: 
        (:= array ([] 0))
        (~= loop i bounds (:
          (.= array i (+ i start))
          (? (< i bounds) (loop (+ i 1) bounds) array)))
        (loop 0 (- end start)))))
        
        
        (:= map (-> array callback (: 
        (:= new_array ([] 0))
        (:= i 0)
        (~= loop i bounds (:
          (.= new_array i (callback (. array i) i))
          (? (< i bounds) (loop (+ i 1) bounds) new_array)))
        (loop 0 (- (.. array) 1)))))
        
        
        (:= filter (-> array callback (: 
        (:= new_array ([] 0))
        (:= i 0)
        (~= loop i bounds (:
          (:= current (. array i))
          (? (callback current i) 
            (.= new_array (.. new_array) current))
          (? (< i bounds) (loop (+ i 1) bounds) new_array)))
        (loop 0 (- (.. array) 1)))))
        
        (:= reduce (-> array callback initial (:
          (~= loop i bounds (:
            (= initial (callback initial (. array i) i))
            (? (< i bounds) (loop (+ i 1) bounds) initial)))
        (loop 0 (- (.. array) 1)))))
        
  
  (:= is_odd (-> x i (== (% x 2) 1)))
  (:= mult_2 (-> x i (* x 2)))
  (:= sum (-> a x i (+ a x)))
  
  (|> 
    ([] 1 2 3 4 5 6 7 101) 
    (filter is_odd)
    (map mult_2)
    (reduce sum 0)
  )
  `,
  ].forEach((source) =>
    deepStrictEqual(runFromInterpreted(source), runFromCompiled(source))
  ))
