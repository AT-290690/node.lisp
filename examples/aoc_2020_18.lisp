(import std "split" "map" "join" "reduce" "for-each" "push" "every" "map" "remove" "array-in-bounds-p" "deep-flat" "concat" "split-by-lines")
(import math "sum-array" "product-array")

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
      (set head (length head) ())
      (set stack (length stack) head)
      (setf head (get head -1)))
    (= token ")") (do 
      (setf head (get stack -1))
      (set stack -1))) 
    (set head (length head) token)) stack)) (Array ()))
  (remove (lambda x . . (length x))))
  head))

(deftype evaluate (Lambda (Or (Array)) (Or (Number)) (Or (Number))))
(defun evaluate args index (do
  (defconstant expression (get args index))
  (unless (Arrayp expression) (type expression Number) 
  (go expression (reduce (lambda a x i . 
    (if (= (mod i 2) 1) 
      (set a (- (length a) 1)
        (cond
          (= x "+") (+ (get a -1) (evaluate expression (+ i 1)))
          (= x "*") (* (get a -1) (evaluate expression (+ i 1))))) a)) 
  (Array (evaluate expression 0))) (get -1)))))

(deftype evaluate-adv (Lambda (Or (Array)) (Or (Number)) (Or (Number))))
(defun evaluate-adv args index (do
  (defconstant expression (get args index))
  (unless (Arrayp expression) (type expression Number) 
  (go expression (reduce (lambda a x i . 
    (if (= (mod i 2) 1) (do 
      (defconstant right (evaluate-adv expression (+ i 1)))
        (cond
          (= x "+") (set a (- (length a) 1) (+ (get a -1) right)) 
          (= x "*") (set a (length a) right))) a))
  (Array (evaluate-adv expression 0))) (product-array)))))

(Array 
  (go *INPUT*
    (split-by-lines)
    (map (lambda x . . (go x (parse) (evaluate 0))))
    (sum-array))
  (go *INPUT*
    (split-by-lines)
    (map (lambda x . . (go x (parse) (evaluate-adv 0))))
    (sum-array)))
