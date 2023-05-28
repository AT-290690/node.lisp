
(:= push (-> array value (.= array (.. array) value)))
(:= concat (-> array1 array2 (:
  (~= loop i bounds (:
  (push array1 (. array2 i))
  (? (< i bounds) 
    (loop (+ i 1) bounds)
  array1
  )))
(loop 0 (- (.. array2) 1)))))


(:= quick_sort (-> arr (:
  (? (<= (.. arr) 1) arr 
  
  (:
    (:= pivot (. arr 0))
    (:= left_arr ([] 0))
    (:= right_arr ([] 0))
    
(~= loop i bounds (:
    (:= current (. arr (- i 1)))
    (? 
      (< current pivot) 
      (push left_arr current)
      (push right_arr current)
    )

  (? (< i bounds) (loop (+ i 1) bounds))))
 (loop 1 (.. arr))


(... 
  (concat (
    push (quick_sort left_arr) pivot) 
    (quick_sort right_arr))
)
)))))


(quick_sort ([] 7 1 4))