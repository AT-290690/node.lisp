(function every array callback (block
    (let bol 1)
    (loop iterate i bounds (block
      (let res (callback (get array i) i array))
      (if (not res) (let* bol 0))
      (if (and res (< i bounds)) (iterate (+ i 1) bounds) bol)))
    (iterate 0 (- (length array) 1))))

    (do 
    (Array 1 1 1 1 1)
    (every (lambda x _ _ (= x 1)))
    (log)
    )