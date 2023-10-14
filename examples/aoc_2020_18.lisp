(import std "map" "push!" "pop!" "drop!" "reduce" "for-each" "every?" "map" "select" "array-in-bounds?" "deep-flat" "concat")
(import str "split-by-lines" "split" "join")
(import math "odd?" "summation" "product")

(defconstant *INPUT* 
"1 + 2 * 3 + 4 * 5 + 6
1 + (2 * 3) + (4 * (5 + 6))
2 * 3 + (4 * 5)
5 + (8 * 3 + 9 + 3 * 4 * 3)
5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))
((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2")
 
(deftype parse (Lambda (Or (String)) (Or (Array))))
(defun parse input (do 
(defvar head ())
(go
  (concatenate "(" input ")")
  (split " ")
  (join "")
  (type Array)
  (reduce (lambda stack token . . (do
  (or (cond 
    (= token "(") (do
      (push! head ())
      (push! stack head)
      (setf head (get head -1)))
    (= token ")") (do 
      (setf head (get stack -1))
      (pop! stack))) 
    (push! head token)) 
  stack)) (Array ()))
  (select (lambda x . . (length x))))
  head))

(deftype evaluate (Lambda (Or (Array)) (Or (Number)) (Or (Number))))
(defun evaluate args index (do
  (defconstant expression (get args index))
  (unless (Array? expression) (type expression Number) 
  (go expression (reduce (lambda a x i . 
    (if (odd? i)
      (push! a
        (cond
          (= x "+") (+ (drop! a) (evaluate expression (+ i 1)))
          (= x "*") (* (drop! a) (evaluate expression (+ i 1))))) a)) 
  (Array (evaluate expression 0))) (get -1)))))

(deftype evaluate-adv (Lambda (Or (Array)) (Or (Number)) (Or (Number))))
(defun evaluate-adv args index (do
  (defconstant expression (get args index))
  (unless (Array? expression) (type expression Number) 
  (go expression (reduce (lambda a x i . 
    (if (odd? i) (do 
      (defconstant right (evaluate-adv expression (+ i 1)))
        (cond
          (= x "+") (push! a (+ (drop! a) right)) 
          (= x "*") (push! a right))) a))
  (Array (evaluate-adv expression 0))) (product)))))

(Array 
  (go *INPUT*
    (split-by-lines)
    (map (lambda x . . (go x (parse) (evaluate 0))))
    (summation))
  (go *INPUT*
    (split-by-lines)
    (map (lambda x . . (go x (parse) (evaluate-adv 0))))
    (summation)))
