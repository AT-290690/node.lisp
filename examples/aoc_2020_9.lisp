(import std "window" "map" "array-of-numbers" "reduce" "some?" "find" "slice")
(import str "split-by" )
(import math "minimum" "maximum" "can-sum?" "range" "min" "max" "summation")
; The data is encrypted with the eXchange-Masking Addition System (XMAS).
; XMAS transmits a preamble of 25 *numbers* and each subsequent number should be the sum of any two of the 25 immediately previous *numbers*.
; The first number that is not the sum of two of the 25 *numbers* before it needs to be found.
; Example: A larger sequence is given with a preamble of length 5.
; After the preamble, almost every? number is the sum of two of the previous 5 *numbers* except for one number.
; The task is to find the first number in the list (after the preamble) that does not follow this rule.
(defconstant sample "35
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

(defconstant *input* sample)
; (defvar *input* (:open "./playground/src/aoc_2020/9/input.txt"))
(defconstant *numbers* (go 
  *input* 
  (split-by "\n") 
  (array-of-numbers)))

  (deftype find-preamble (Lambda (Or (Array (Number))) (Or (Number)) (Or (Number))))
  
  (defun find-preamble inp n (go inp 
    (find (lambda current i all 
      (when (>= i n) 
       (not (can-sum? current (slice all (- i n) i))))))))

(defconstant *preamble* (find-preamble *numbers* (if (> (length *numbers*) 25) 25 5)))

(defvar *weakness* (Array))
(go (range 2 (- (length *numbers*) 1))
    (some? (lambda n . .
      (some? (window *numbers* n) (lambda x . . (do 
        (and (= (summation x) *preamble*) (setf *weakness* x))))))))
(Array 
  ; 21806024
  *preamble* 
  ; 2986195
  (+ 
    (minimum *weakness*)
    (maximum *weakness*)))