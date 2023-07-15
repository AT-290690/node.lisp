(import std "find" "split" "map" "quick-sort" "adjacent-difference" "push" "every" "remove" "min" "reduce" "round" "floor" "product-array")
(let sample1 "939
7,13,x,x,59,x,31,19")
(let sample2 "1001171
17,x,x,x,x,x,x,41,x,x,x,37,x,x,x,x,x,367,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,19,x,x,x,23,x,x,x,x,x,29,x,613,x,x,x,x,x,x,x,x,x,x,x,x,13")
(function *parse_input* inp 
  (block 
    (declare 
      INP (do inp (split "\n"))
      time (type (car INP) Number)
      buses (do (car (cdr INP)) (split ",") (map (lambda x _ _ (if (= x "x") 0 (type x Number)))) (remove (lambda x _ _ (> x 0)))))
    (Array time buses)
    ))

(function *solve1* inp (block 
(declare 
  *INP* (*parse_input* inp)
  *time* (car *INP*)
  *buses* (car (cdr *INP*)))
(do 
  *buses*
  (map (lambda x _ _  (Array x (- x (mod *time* x)))))
  (reduce (lambda a b _ _ (if (> (car (cdr a)) (car (cdr b))) b a)) (Array 0 100000))
  (product-array))))

(Array 
 (*solve1* sample1)
 (*solve1* sample2)
)
