import { deepStrictEqual, strictEqual } from 'assert'
import { runFromInterpreted } from '../src/utils.js'
it('interpretation should work', () => {
  strictEqual(
    runFromInterpreted(`(:= range (-> start end (: 
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
  `),
    [299, 1041, 1654, 1721, 1345, 564]
  )

  strictEqual(
    runFromInterpreted(`(|> 1 
    (+ 2) 
      (* 3 4)
       (- 3 2))`),
    31
  )
})
