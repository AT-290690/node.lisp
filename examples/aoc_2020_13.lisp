(import std "adjacent-difference" "abs" "average" "square" "cartesian-product" "slice-if-index" "remove" "greatest-common-divisor" "every" "sqrt" "is-prime" "find" "split" "map" "quick-sort" "adjacent-difference" "push" "every" "remove" "min" "max" "reduce" "round" "floor" "product-array" "sum-array" "for-each")
(defvar sample "939
7,13,x,x,59,x,31,19")
(defvar input "1001171
17,x,x,x,x,x,x,41,x,x,x,37,x,x,x,x,x,367,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,19,x,x,x,23,x,x,x,x,x,29,x,613,x,x,x,x,x,x,x,x,x,x,x,x,13")

(defun *solve1* inp 
  (do
    (defun parse inp 
      (do 
        (defvar 
          INP (go inp (split "\n"))
          time (type (car INP) Number)
          buses (go (car (cdr INP)) (split ",") (map (lambda x . . (if (= x "x") 0 (type x Number)))) (remove (lambda x . . (> x 0)))))
      (Array time buses)))
    (defvar 
      *INP* (parse inp)
      *time* (car *INP*)
      *buses* (car (cdr *INP*)))
    (go 
      *buses*
      (map (lambda x . . (Array x (- x (mod *time* x)))))
      (reduce (lambda a b . . (if (> (car (cdr a)) (car (cdr b))) b a)) (Array 0 100000))
      (product-array))))

(defun is-array-of-coprime-pairs inp (and 
        (go inp (every (lambda x . . (is-prime x)))) 
        (go inp (adjacent-difference (lambda a b (greatest-common-divisor a b))) (cdr) (every (lambda x . . (= x 1))))))

(defun chinese-remainder-theorem buses 
  (do 
    (defvar result (car (car buses)))
      (reduce 
        (cdr buses) 
        (lambda step bus . . (do 
        (defvar id (car bus)
            index (car (cdr bus)))
        (loop defun crt time
          (unless (= (mod (+ time index) id) 0) 
            (crt (+ time step)) 
            time))
        (setf result (crt result))
        (* step id))) 
        result)
      result))

(defun *solve2* input 
  (do
    (defun parse inp 
      (do 
        (defvar 
          INP (go inp (split "\n"))
          time (type (car INP) Number)
          buses (go (car (cdr INP)) (split ",") (reduce (lambda acc x i . (unless (= x "x") (set acc (length acc) (Array (type x Number) i)) acc)) ())))
        (Array time buses)))
      (defvar inp (car (cdr (parse input))))
      (unless (is-array-of-coprime-pairs (map inp (lambda x . . (car x)))) 
        (error "Chinese remainder theorem only works if all numbers are pairwise coprime")
        (chinese-remainder-theorem inp))))

(Array 
 (*solve1* sample)
 (*solve1* input)
 (*solve2* sample)
 (*solve2* input)) 
