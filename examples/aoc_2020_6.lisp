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

(defun remove-duplicates string (do (type string Array) (remove (lambda item pos self (= (index-of self item) pos)))))

(defvar *lines* (do *input* (split-by-n-lines 2)))
(defvar *unique_chars* (do *lines* (map (lambda x _ _ (do x (join "") (remove-duplicates))))))

(Array (do *unique_chars* 
  (map (lambda x _ _ (length x)))
  (sum-array))

(do *lines* 
  (map (lambda line i _ (block 
    (defvar *unique-char* (get *unique_chars* i))
    (do line 
      (map (lambda ch _ _ (do *unique-char* (map (lambda *ch* _ _ (character-occurances-in-string ch *ch*))) (join "") (type Bit))))
      (accumulate (lambda a b _ _ (& a b)))))))
      (map (lambda y _ _ (do y (Bit) (type Array) (array-of-numbers) (sum-array))))
      (sum-array)))