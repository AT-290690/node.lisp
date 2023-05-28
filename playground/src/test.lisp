(import "find" "max")
(:= find (lambda array callback (block
      (loop iterate i bounds (block
        (:= current (get array i))
        (if (and (not (callback current i)) (< i bounds))
          (iterate (+ i 1) bounds) 
          current)))
          (iterate 0 (- (length array) 1)))))
    
(:= array (' 1 2 3 4 5 6))
(do  
  (max (find array (lambda x i (eq i 2))) (find array (lambda x i (eq i 4))))
  (log))
(log (Arrayp (Array 10)))