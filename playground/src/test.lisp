(function reduce array callback initial (block
  (loop iterate i bounds (block
    (let* initial (callback initial (get array i) i array))
    (if (< i bounds) (iterate (+ i 1) bounds) initial)))
  (iterate 0 (- (length array) 1))))
(function join array delim (reduce array (lambda a x i o (concatenate a delim x)) ""))
(do 
"./std/std.lisp"
(open) 
(format  (esc "n"))
(join " ")
(log)
)
