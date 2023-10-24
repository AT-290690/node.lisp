(import std "fold" "map" "scan" "empty?" "drop!" "concat" "clone" "slice" "some?" "reverse" "strings->numbers" "reduce" "every?" )
(import str "split-by-n-lines" "split" "join" "trim")
(import math "summation")
; (defconstant *input* (go 
;  (:open "./playground/src/aoc_2020/19/input.txt")
; (split-by-n-lines 2)))
(defconstant *input* (go 
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

(destructuring-bind rules messages . *input*)
(deftype parse-rules (Lambda (Or (Array (String))) (Or (Array (Function))) (Or (Array (Array)))))
(defun parse-rules rules funcs (do 
    (destructuring-bind map scan fold split trim strings->numbers . funcs)
    (go 
      rules
      (scan (lambda x (do 
          (defconstant 
              parts (split x ": ")
              index (type (car parts) Number)
              ored (split (car (cdr parts)) "|"))
          (Array index 
          (cond 
            (or (= (car ored) "\"a\"") (= (car ored) "\"b\"")) "MATCH"
            (> (length ored) 1) "OR" 
            (= (length ored) 1) "AND")
          (map ored (lambda x i a 
            (if (or (= x "\"a\"") (= x "\"b\""))
            (Array (car (cdr (split x (char 34)))))
            (strings->numbers (split (trim x) " ")))))))))
      (fold (lambda a x (set a (car x) (cdr x))) 
      (Array (length rules) length)))))

(defconstant *rules* (parse-rules rules (' map scan fold split trim strings->numbers)))
(defconstant *messages* (go messages (scan (lambda x (type x Array)))))

(deftype match? (Lambda (Or (Array (String))) (Or (Array (Number))) (Or (Number))))
(defun match? msg queue 
  (cond 
    (and 
      (empty? msg) (empty? queue)) 1
    (or 
      (and (not (empty? msg)) (empty? queue)) 
      (and (empty? msg) (not (empty? queue)))) 0
    (*) (do
          (destructuring-bind kind rule . (get *rules* (drop! queue)))
          (cond
            (= kind "AND") 
              (match? msg (concat queue (reverse (car rule))))
            (= kind "OR") 
              (or 
               (match? msg (concat (clone queue) (reverse (car rule))))
               (match? msg (concat (clone queue) (reverse (car (cdr rule))))))
            (= kind "MATCH") 
              (and 
                (= (car (car rule)) (car msg)) 
                (match? (cdr msg) queue))))))

(Array (go
  *messages*
  (scan (lambda msg (match? msg (' 0))))
  (summation)))


; ; 8: 42 | 42 8
; ; 11: 42 31 | 42 11 31
; (set *rules* 8 (' "OR" (' (' 42) (' 42 8))))
; (set *rules* 11 (' "OR" (' (' 42 31) (' 42 11 31))))

; (log (go
;   *messages*
;   (map (lambda msg . . (match? msg (' 0))))
;   (summation)))
