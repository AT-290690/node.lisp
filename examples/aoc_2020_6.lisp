(import std "accumulate" "array-of-numbers" "split-by-n-lines" "character-occurances-in-string" "join" "reduce" "index-of" "map" "select")
(import math "summation")
(defconstant sample "abc

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

(defconstant *input* sample)
; (defvar *input* (:open "./playground/src/aoc_2020/6/input.txt"))
(deftype select-duplicates-of-strings (Lambda (Or (String)) (Or (Array (String)))))
(defun select-duplicates-of-strings string (go (type string Array) (select (lambda item pos self (= (index-of self item) pos)))))

(defconstant *lines* (go *input* (split-by-n-lines 2)))
(defconstant *unique_chars* (go *lines* (map (lambda x . . (go x (join "") (select-duplicates-of-strings))))))

(Array (go *unique_chars* 
  (map (lambda x . . (length x)))
  (summation))

(go *lines* 
  (map (lambda line i . (do 
    (defconstant *unique-char* (get *unique_chars* i))
    (go line 
      (map (lambda ch . . (go *unique-char* (map (lambda *ch* . . (character-occurances-in-string ch *ch*))) (join "") (type Bit))))
      (accumulate (lambda a b . . (& a b)))))))
      (map (lambda y . . (go y (Bit) (type Array) (array-of-numbers) (summation))))
      (summation)))