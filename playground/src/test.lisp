(:= join (lambda array delim (reduce array (lambda a x i (++ a delim x)) "")))
(:= string_to_array (lambda string delim (reduce (... string) (lambda a x i (block
                                          (if (eq x delim) (push a (Array 0)) (block 
                                          (push (get a -1) x) a))))(push (Array 0) (Array 0)))))
(:= split_by_lines (lambda string (map (string_to_array string (esc "n")) (lambda x i (join x "")))))

(do 
  (open "./playground/src/input.txt")
  (split_by_lines)
  (map (lambda x i (` (x))))
  (reduce sum 0)
  (log))