(import std "slice-if-index" "select" "every" "find" "split" "map" "quick-sort" "push" "every" "select" "reduce" "for-each")
(import math "min" "max" "round" "floor" "greatest-common-divisor" "product" "summation" "sqrt" "is-prime" "adjacent-difference" "abs" "average" "square" )
(defconstant sample "939
7,13,x,x,59,x,31,19")
(defconstant input "1001171
17,x,x,x,x,x,x,41,x,x,x,37,x,x,x,x,x,367,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,19,x,x,x,23,x,x,x,x,x,29,x,613,x,x,x,x,x,x,x,x,x,x,x,x,13")
(deftype *solve1* (Lambda (Or (String)) (Or (Number))))
(defun *solve1* inp 
  (do
    (defun parse inp 
      (do 
        (defconstant 
          INP (go inp (split "\n"))
          time (type (car INP) Number)
          buses (go 
                  (car (cdr INP)) 
                  (split ",") 
                  (map (lambda x . . (if (= x "x") 0 (type x Number)))) 
                  (select (lambda x . . (> x 0)))))
      (Array time buses)))
    (defconstant 
      *INP* (parse inp)
      *time* (car *INP*)
      *buses* (car (cdr *INP*)))
    (go 
      *buses*
      (map (lambda x . . (Array x (- x (mod *time* x)))))
      (reduce (lambda a b . . (if (> (car (cdr a)) (car (cdr b))) b a)) (Array 0 100000))
      (product))))

(deftype is-array-of-coprime-pairs (Lambda (Or (Array (Number))) (Or (Number))))
(defun is-array-of-coprime-pairs inp (and 
        (go inp (every (lambda x . . (is-prime x)))) 
        (go inp (adjacent-difference (lambda a b (greatest-common-divisor a b))) (cdr) (every (lambda x . . (= x 1))))))

(deftype chinese-remainder-theorem (Lambda (Or (Array (Array (Number)))) (Or (Number))))
(defun chinese-remainder-theorem items
  (do 
    (defvar result (car (car items)))
      (reduce 
        (cdr items) 
        (lambda step item . . (do 
        (defconstant
            id (car item)
            index (car (cdr item)))
        (loop defun rem time
          (unless (= (mod (+ time index) id) 0) 
            (rem (+ time step)) 
            time))
        (setf result (rem result))
        (* step id))) 
        result)
      result))

(deftype *solve2* (Lambda (Or (String)) (Or (Number))))
(defun *solve2* input 
  (do
    (defun parse inp 
      (do 
        (defconstant 
          INP (go inp (split "\n"))
          time (type (car INP) Number)
          buses (go 
                  (car (cdr INP)) 
                  (split ",") 
                  (reduce (lambda acc x i . (unless (= x "x") (set acc (length acc) (Array (type x Number) i)) acc)) (Array))))
        (Array time buses)))
      (defconstant inp (car (cdr (parse input))))
      (unless (is-array-of-coprime-pairs (map inp (lambda x . . (car x)))) 
        (throw "Chinese remainder theorem only works if all numbers are pairwise coprime")
        (chinese-remainder-theorem inp))))

(Array 
 (*solve1* sample)
 (*solve1* input)
 (*solve2* sample)
 (*solve2* input))