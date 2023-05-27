(:= range (-> start end (: 
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
(reduce sum 0)
(log))

