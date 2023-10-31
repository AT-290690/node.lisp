(import std "map" "reverse" "scan" "sort" "strings->numbers" "reduce" "concat" "zip")
(import math "range" "summation")
(import str "split-by-n-lines")
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
                              
(destructuring-bind a b . (go 
  sample
  (split-by-n-lines 2) 
  (scan (lambda x 
              (go 
                x 
                (cdr) 
                (strings->numbers))))))
(Array 
  (go 
    (defconstant winner (combat a b)) 
    (zip (reverse (range 1 (length winner)))) 
    (scan (lambda x (* (car x) (car (cdr x))))) 
    (summation)))