(import std "strings->numbers" "reduce" "quick-sort" "map" "concat" "count-of" "array-in-bounds?")
(import math "adjacent-difference" "max")
(import str "split-by" "join")
(defconstant sample "16
10
15
5
1
11
7
19
6
12
4")

(defconstant sample2 "28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3")

(defconstant *input* sample)
; (defconstant *input* (:open "./playground/src/aoc_2020/10/input.txt"))

; part 1
(defconstant *parsed-input* (go *input* (split-by "\n") (strings->numbers)))

(defconstant diffs (go *parsed-input* 
   (quick-sort) 
   (adjacent-difference (lambda a b (- b a)))))

; part 2
(deftype combinations (Lambda (Or (Array (Number))) (Or (Number)) (Or (Array (Number))) (Or (Number))))
(defun combinations inp i memo
      (if (array-in-bounds? memo i)
        (get memo i) 
      ; else 
        (do
          (defvar result 0)
          (loop defun iterate j (do 
            (when (and (>= j 0) (<= (- (get inp i) (get inp j)) 3)) 
              (do
                (setf result (+ result (combinations inp j memo)))
                (iterate (- j 1))))))
            (iterate (- i 1))
            (set memo i result)
            result)))
(deftype iterative-solution (Lambda (Or (Array (Number))) (Or (Number))))
(defun iterative-solution inp (do
  (defconstant 
    memo (Array 1)
    size (length inp))
  (loop defun iterate-i i (do
    (when (< i size) 
      (do 
        (set memo i 0) 
        (loop defun iterate-j j (when (and (>= j 0) (<= (- (get inp i) (get inp j)) 3)) 
          (do
            (set memo i (+ (get memo i) (get memo j)))
            (iterate-j (- j 1)))))
        (iterate-j (- i 1))
        (iterate-i (+ i 1))))))
  (iterate-i 1)
  (get memo -1)))
(deftype transform-input (Lambda (Or (Array (Number))) (Or (Array (Number)))))
(defun transform-input input (do 
                          (defconstant sorted 
                              (go input 
                                (set (length input) 0) 
                                (quick-sort)))
                          (set  
                            sorted
                            (length sorted) 
                            (+ (get sorted -1) 3))))

(defconstant *transformed-input* (go *parsed-input* (transform-input)))

(Array
; part 1
  (* 
    (go 
      diffs 
      (count-of (lambda x . . (= x 1))))
      (+ (go 
          diffs
          (count-of (lambda x . . (= x 3)))) 1))
; part 2
; recursive
 (go  
  *transformed-input*
  (combinations (- (length *transformed-input*) 1) (Array 1)))
 ; iterative 
 (go 
    *transformed-input*
    (iterative-solution)))
