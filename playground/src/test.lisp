;   (function for_each array callback (block
;     (loop iterate i bounds (block
;       (callback (get array i) i array)
;       (if (< i bounds) (iterate (+ i 1) bounds) array)))
;     (iterate 0 (- (length array) 1))))
; (do (... "Hello World") (for_each (lambda x _ _ (log x))))


; (loop move 
;             n from to stare 
;             (if (>= n 1)
;             (block 
;               (move (- n 1) from stare to)
;               (log (concatenate "Move disk from tower " from " to tower " to))
;               (move (- n 1) stare to from))))
; (move 3 "A" "B" "C")
; (log (probe-file))


(do (Array (Array 1 2 3 4 5) 2 3 4) (car) (cdr) (car) (log))