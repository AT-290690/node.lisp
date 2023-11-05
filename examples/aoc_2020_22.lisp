(import std "map" "reverse" "scan" "array-in-bounds?" "slice" "find-index" "index-of" "empty!" "sort" "strings->numbers" "reduce" "concat" "zip")
(import math "range" "summation" "euclidean-mod")
(import str "split-by-n-lines" "join")
(import ds "hash-set" "hash-index" "hash-set?" "hash-set-add!")
(defconstant sample "Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10")

(defun combat a b 
  (if 
    (and (length a) (length b)) 
    (do (if (> (car a) (car b)) 
         (concat a (Array (car a) (car b)))
         (concat b (Array (car b) (car a)))) 
    (combat (cdr a) (cdr b)))
    (if (> (length a) (length b)) a b)))
                              
(defun combat-part2 a b visited
  (if 
    (and (length a) (length b)) 
    (if 
      ; recursive case 
      (hash-set? visited (defconstant key (concatenate (join a " ") " | " (join b " ")))) (Array 1 a)
      ; sumb game case
      (do 
          (defvar winner 1)
          (defconstant da (cdr a))
          (defconstant db (cdr b))
        (if 
          (and 
                (hash-set-add! visited key) 
                (>= (length da) (car a)) 
                (>= (length db) (car b))) 
          (do 
            (setf winner (car (combat-part2 (slice da 0 (car a)) (slice db 0 (car b)) (hash-set 10)))))
          ; normal case
          (setf winner (> (car a) (car b))))
        (if winner
                (concat da (Array (car a) (car b)))
                (concat db (Array (car b) (car a)))) 
          (combat-part2 da db visited)))
    (if (length a) (Array 1 a) (Array 0 b))))

(defun solve1 (do 
(destructuring-bind a b . (go 
  sample
  (split-by-n-lines 2) 
  (scan (lambda x 
              (go 
                x 
                (cdr) 
                (strings->numbers))))))
    (go 
    (defconstant winner (combat a b)) 
    (zip (reverse (range 1 (length winner)))) 
    (scan (lambda x (* (car x) (car (cdr x))))) 
    (summation))))
(defun solve2 (do 
(destructuring-bind a b . (go 
  sample
  (split-by-n-lines 2) 
  (scan (lambda x 
              (go 
                x 
                (cdr) 
                (strings->numbers))))))
    (go 
     (defconstant winner (car (cdr (combat-part2 a b (hash-set 10)))))
     (zip (reverse (range 1 (length winner)))) 
     (scan (lambda x (* (car x) (car (cdr x))))) 
     (summation))))
(Array 
  (solve1)
  (solve2))



