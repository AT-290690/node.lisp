(import std "split-by" "array-of-numbers" "reduce" "max" "quick-sort" "map" "concat" "push" "adjacent-difference" "count-of" "join" "array-in-bounds-p")
(defvar sample "16
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

(defvar sample2 "28
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

(defvar *input* sample)
; (defvar *input* (open "./playground/src/aoc_2020/10/input.txt"))

; part 1
(defvar *parsed-input* (trace *input* (split-by "\n") (array-of-numbers)))

(defvar diffs (trace *parsed-input* 
   (quick-sort) 
   (adjacent-difference (lambda a b (- b a)))))

; part 2
(defun combinations inp index memo
      (if (array-in-bounds-p memo index) (get memo index) (do 
        (defvar result 0)
        (loop defun iterate j (do 
          (if (and (>= j 0) (<= (- (get inp index) (get inp j)) 3)) 
            (do
              (setf result (+ result (combinations inp j memo)))
              (iterate (- j 1))))))
          (iterate (- index 1))
          (set memo index result)
          result)))

(defun iterative-solution inp (do
  (defvar 
    memo (Array 1)
    size (length inp))
  (loop defun iterate-i i (do
    (if (< i size) 
      (do 
        (set memo i 0) 
        (loop defun iterate-j j (if (and (>= j 0) (<= (- (get inp i) (get inp j)) 3)) 
          (do
            (set memo i (+ (get memo i) (get memo j)))
            (iterate-j (- j 1)))))
        (iterate-j (- i 1))
        (iterate-i (+ i 1))))))
  (iterate-i 1)
  (get memo -1)))

(defun transform-input input
                          (set 
                            (defvar sorted 
                              (trace input 
                                (set (length input) 0) 
                                (quick-sort))) 
                            (length sorted) 
                            (+ (get sorted -1) 3)))

(defvar *transformed-input* (trace *parsed-input* (transform-input)))

(Array
; part 1
  (* 
    (trace 
      diffs 
      (count-of (lambda x . . (= x 1))))
      (+ (trace 
          diffs
          (count-of (lambda x . . (= x 3)))) 1))
; part 2
; recursive
 (trace  
  *transformed-input*
  (combinations (- (length *transformed-input*) 1) (Array 1)))
 ; iterative 
 (trace 
    *transformed-input*
    (iterative-solution)))
