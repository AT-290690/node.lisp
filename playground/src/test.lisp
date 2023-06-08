(import std "split_by_n_lines" "trim")
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

(do sample (trim) (split_by_n_lines 2) I (log))


