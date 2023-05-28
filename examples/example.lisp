(function sum_array array (reduce array sum 0))
(do 
  (Array 1 2 3 4 5 6 7 101) 
  (filter is_odd)
  (map (lambda x i (* x 2)))
  (sum_array)
)
