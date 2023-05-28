(:= max (-> a b (? (> a b) a b)))
(:= min (-> a b (? (< a b) a b)))
(:= is_odd (-> x i (== (% x 2) 1)))
(:= is_even (-> x i (== (% x 2) 0)))
(:= sum (-> a x i (+ a x)))
(:= push (-> array value (.= array (.. array) value)))
(:= euclidean_mod (-> a b (% (+ (% a b) b) b)))

(:= concat (-> array1 array2 (:
  (~= loop i bounds (:
  (push array1 (. array2 i))
  (? (< i bounds) 
    (loop (+ i 1) bounds)
  array1
  )))
(loop 0 (- (.. array2) 1)))))

(:= range (-> start end (: 
  (:= array ([] 0))
  (~= loop i bounds (:
    (push array (+ i start))
    (? (< i bounds) (loop (+ i 1) bounds) array)))
  (loop 0 (- end start)))))


(:= map (-> array callback (: 
  (:= new_array ([] 0))
  (:= i 0)
  (~= loop i bounds (:
    (.= new_array i (callback (. array i) i))
    (? (< i bounds) (loop (+ i 1) bounds) new_array)))
  (loop 0 (- (.. array) 1)))))

(:= for_each (-> array callback (: 
  (~= loop i bounds (:
    (callback (. array i) i)
    (? (< i bounds) (loop (+ i 1) bounds) array)))
  (loop 0 (- (.. array) 1)))))


(:= filter (-> array callback (: 
  (:= new_array ([] 0))
  (:= i 0)
  (~= loop i bounds (:
    (:= current (. array i))
    (? (callback current i) 
      (push new_array current))
    (? (< i bounds) (loop (+ i 1) bounds) new_array)))
  (loop 0 (- (.. array) 1)))))

(:= reduce (-> array callback initial (:
  (~= loop i bounds (:
    (= initial (callback initial (. array i) i))
    (? (< i bounds) (loop (+ i 1) bounds) initial)))
  (loop 0 (- (.. array) 1)))))

(:= deep_flat (-> arr (: 
  (:= new_array ([] 0)) 
  (~= flatten item (? ([?] item) (for_each item (-> x _ (flatten x))) 
  (push new_array item)))
  (flatten arr) 
  new_array
)))