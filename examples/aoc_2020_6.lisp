(import std "accumulate" "split_by_n_lines" "character_occurances_in_string" "join" "sum_array" "reduce" "index_of" "push" "map" "remove")
(let sample "abc

a
b
c

ab
ac

a
a
a
a

b")

(let input sample)
(let input (open "./playground/src/aoc_2020/6/input.txt"))

(function remove_duplicates string (do (... string) (remove (lambda item pos self (= (index_of self item) pos)))))
(do input
  (split_by_n_lines 2)
  (map (lambda x _ _ (do x (join "") (remove_duplicates) (length))))
  (sum_array)
  (log))

(let lines (do input (split_by_n_lines 2)))
(let unique_chars (do lines (map (lambda x _ _ (do x (join "") (remove_duplicates))))))
(do lines 
  (map (lambda x i o (block 
    (let current (get unique_chars i))
    (do x 
      (map (lambda y _ _ (do current (map (lambda z _ _ (character_occurances_in_string y z))) (join "") (type Bit))))
      (accumulate (lambda a b _ _ (& a b)))))))
      (map (lambda y _ _ (do y (Bit) (...) (map (lambda d _ _ (type d Number))) (sum_array))))
      (sum_array)
      (log))