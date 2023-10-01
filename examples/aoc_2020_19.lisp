(import std "map" "empty?" "drop" "concat" "for-each" "clone" "slice" "split-by-n-lines" "some?" "every?" "reverse" "split" "join" "trim" "array-of-numbers" "reduce" "every?" "count-of" )
(import math "summation")
; (defconstant *INPUT* (go 
;  (:open "./playground/src/aoc_2020/19/input.txt")
; (split-by-n-lines 2)))
(defconstant *INPUT* (go 
"0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: \"a\"
5: \"b\"

ababbb
bababa
abbbab
aaabbb
aaaabbb"
(split-by-n-lines 2)))

(destructuring-bind rules messages . *INPUT*)
(deftype parse-rules (Lambda (Or (Array (String))) (Or (Array (Array)))))
(defun parse-rules rules (go rules
                        (map (lambda x . . (do 
                            (defconstant parts (split x ": "))
                            (defconstant index (type (car parts) Number))
                            (defconstant ored (split (car (cdr parts)) "|"))
                            (Array index 
                            (cond 
                              (or (= (car ored) "\"a\"") (= (car ored) "\"b\"")) "MATCH"
                              (> (length ored) 1) "OR" 
                              (= (length ored) 1) "AND")
                            (map ored (lambda x i a 
                              (if (or (= x "\"a\"") (= x "\"b\""))
                              (Array (car (cdr (split x (char 34)))))
                              (array-of-numbers (split (trim x) " ")))))))))
                        (reduce (lambda a x . . (set a (car x) (cdr x))) 
                        (Array (length rules) length))))

(defconstant *RULES* (parse-rules rules))
(defconstant *MESSAGES* (go messages (map (lambda x . . (type x Array)))))

 
(defun match_seq chars seq stack (do 
              (go (car (car (cdr seq))) (reverse) (for-each (lambda x . . (set stack (length stack) x))))
              (match chars stack)))

(deftype match-seq? (Lambda (Or (Array (String))) (Or (Array (Number))) (Or (Array (Number))) (Or (Number))))
(defun match-seq? msg queue sequance (match? msg (concat queue (reverse sequance))))
(deftype match? (Lambda (Or (Array (String))) (Or (Array (Number))) (Or (Number))))
(defun match? msg queue 
  (cond 
    (and (empty? msg) (empty? queue)) 1
    (and (not (empty? msg)) (empty? queue)) 0
    () (do
          (destructuring-bind kind rule . (get *RULES* (drop queue)))
          (cond
            (= kind "AND") 
              (match-seq? msg queue (car rule))
            (= kind "OR") 
              (or 
                (match-seq? msg (clone queue) (car rule))
                (match-seq? msg (clone queue) (car (cdr rule))))
            (= kind "MATCH") 
              (and 
                (= (car (car rule)) (car msg)) 
                (match? (cdr msg) queue))))))

(Array (go
  *MESSAGES*
  (map (lambda msg . . (match? msg (' 0))))
  (summation)))