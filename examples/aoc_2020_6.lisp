(import std "accumulate" "array-of-numbers" "split-by-n-lines" "character-occurances-in-string" "join" "sum-array" "reduce" "index-of" "push" "map" "remove")
(defvar sample "abc

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

(defvar *input* sample)
; (defvar *input* (open "./playground/src/aoc_2020/6/input.txt"))

(defun remove-duplicates string (trace (type string Array) (remove (lambda item pos self (= (index-of self item) pos)))))

(defvar *lines* (trace *input* (split-by-n-lines 2)))
(defvar *unique_chars* (trace *lines* (map (lambda x . . (trace x (join "") (remove-duplicates))))))

(Array (trace *unique_chars* 
  (map (lambda x . . (length x)))
  (sum-array))

(trace *lines* 
  (map (lambda line i . (do 
    (defvar *unique-char* (get *unique_chars* i))
    (trace line 
      (map (lambda ch . . (trace *unique-char* (map (lambda *ch* . . (character-occurances-in-string ch *ch*))) (join "") (type Bit))))
      (accumulate (lambda a b . . (& a b)))))))
      (map (lambda y . . (trace y (Bit) (type Array) (array-of-numbers) (sum-array))))
      (sum-array)))