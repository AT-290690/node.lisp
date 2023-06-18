(function is_array_of_atoms array 
      (if (not (length array)) 1 
       (if (atom (car array)) 
        (is_array_of_atoms (cdr array)) 0)))
        (is_array_of_atoms (Array 1 2 (Array 1 2) "5"))

(loop iterate array
  (if (length (cdr array)) (block 
    (if (> (car (cdr (car array))) 3) 
      (log (car array)))
    (iterate (cdr array)))))

; (iterate (car (probe-file)))