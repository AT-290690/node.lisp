(import std "split" "trim" "push" "join" "every" "map")
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

(do
  sample
  (split "\n\n")
  (map (lambda x _ _ (split x "\n")))
  (log))