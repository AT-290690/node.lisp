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

(log (
    reduce (
      map (
        filter ([] 1 2 3 4 5 6 7) 
        (-> x i (== (% x 2) 1))) 
      (-> x i (* x 1))) 
    (-> a x i (+ a x)) 0))
