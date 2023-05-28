(|> 
  ([] 1 2 3 4 5 6 7 101) 
  (filter is_odd)
  (map mult_2)
  (reduce sum 0)
)
