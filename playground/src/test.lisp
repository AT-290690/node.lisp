(:= mult_by_index (-> x i (* x i)))

(|>
 (range 1 50) 
 (filter is_even)
 (map mult_by_index)
 (reduce sum 0)
 (log)
)

(log (euclidean_mod -1 100))