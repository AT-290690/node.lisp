(import std "accumulate" "split-by-n-lines" "character-occurances-in-string" "join" "sum-array" "reduce" "index-of" "push" "map" "remove")
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

(let *input* sample)
; (let *input* (open "./playground/src/aoc_2020/6/input.txt"))

(function remove-duplicates string (do (. string) (remove (lambda item pos self (= (index-of self item) pos)))))

(let lines (do *input* (split-by-n-lines 2)))
(let *unique_chars* (do lines (map (lambda x _ _ (do x (join "") (remove-duplicates))))))

(Array (do *input*
  (split-by-n-lines 2)
  (map (lambda x _ _ (do x (join "") (remove-duplicates) (length))))
  (sum-array))

(do lines 
  (map (lambda x i o (block 
    (let current (get *unique_chars* i))
    (do x 
      (map (lambda y _ _ (do current (map (lambda z _ _ (character-occurances-in-string y z))) (join "") (type Bit))))
      (accumulate (lambda a b _ _ (& a b)))))))
      (map (lambda y _ _ (do y (Bit) (type Array) (map (lambda d _ _ (type d Number))) (sum-array))))
      (sum-array)))