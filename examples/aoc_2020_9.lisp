(import std "split-by" "range" "min" "max" "map" "array-of-numbers" "push" "reduce" "sum-array" "some" "find" "slice")
; The data is encrypted with the eXchange-Masking Addition System (XMAS).
; XMAS transmits a preamble of 25 *numbers* and each subsequent number should be the sum of any two of the 25 immediately previous *numbers*.
; The first number that is not the sum of two of the 25 *numbers* before it needs to be found.
; Example: A larger sequence is given with a preamble of length 5.
; After the preamble, almost every number is the sum of two of the previous 5 *numbers* except for one number.
; The task is to find the first number in the list (after the preamble) that does not follow this rule.
(let sample "35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576")

(let *input* sample)
; (let *input* (open "./playground/src/aoc_2020/9/input.txt"))
(let *numbers* (do 
  *input* 
  (split-by "\n") 
  (array-of-numbers)))

  (loop can-sum t values 
    (if (< t 0) 0 
      (if (= t 0) 1 
        (some values (lambda x _ _ (can-sum (- t x) values))))))
  
  (function find-preamble inp n (do inp 
    (find (lambda current i all 
      (if (>= i n) 
       (not (can-sum current (slice all (- i n) i))))))))

(let *preamble* (find-preamble *numbers* (if (> (length *numbers*) 25) 25 5)))
(function window inp n (do inp 
  (reduce (lambda acc current i all 
    (if (>= i n) 
      (push acc (slice all (- i n) i)) acc)) (Array 0 length))))

(let *weakness* (Array 0 length))
(do (range 2 (- (length *numbers*) 1))
    (some (lambda n _ _
    (some (window *numbers* n) (lambda x _ _ (block 
    (and (= (sum-array x) *preamble*) (let* *weakness* x))))))))

(Array 
  ; 21806024
  *preamble* 
  ; 2986195
  (+ (reduce *weakness* (lambda a b _ _ (max a b)) -1) (reduce *weakness* (lambda a b _ _ (min a b)) *preamble*)))
