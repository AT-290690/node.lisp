(import std "map" "except" "strings->numbers" "push!" "every?" "reduce" "deep-flat" "select" "some?" "reverse"
"for-n" "find" "slice-if-index" "for-each")
(import math "range" "product" "summation")
(import str "split" "split-by-n-lines")
(defconstant sample1 "class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12")

(defconstant sample2 "class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9")
;  (defconstant sample (:open "./playground/src/aoc_2020/16/input.txt"))
(deftype parse-input (Lambda  
                        (Or (String)) 
                        (Or 
                          (Array 
                            (Array (Array (Array (Number) (Number))))
                            (Array (Number)) 
                            (Array (Array (Number)))))))
(defun parse-input sample (do 
  (defconstant lines (go sample (split-by-n-lines 2)))
  (defconstant ticket-ranges 
                      (go 
                        (car lines) 
                        (map (lambda x . . 
                            (map 
                              (split (car (cdr (split x ": "))) " or ") 
                                (lambda y . . 
                                  (go y 
                                    (split "-") 
                                    (strings->numbers))))))))
(defconstant your-ticket (strings->numbers (split (car (cdr (car (cdr lines)))) ",")))
(defconstant nearby-tickets (map (cdr (car (cdr (cdr lines)))) (lambda x . . (go x (split ",") (strings->numbers)))))
(Array ticket-ranges your-ticket nearby-tickets)))
(deftype is-in-bounds (Lambda (Or (Number)) (Or (Array (Number) (Number))) (Or (Number))))
(defun is-in-bounds x rng (and (>= x (car rng)) (<= x (car (cdr rng)))))
(deftype sort-by-len (Lambda (Or (Array (Array (Array (Number))))) (Or (Array (Number))) (Or (Array (Array (Array (Number)))))))
(defun sort-by-len tickets r (map r (lambda x . . (find tickets (lambda y . . (= (- (length y) 1) x))))))
(deftype order-array (Lambda (Or (Array (Array (Number)))) (Or (Array (Number))) (Or (Array (Array (Number))))))
(defun order-array array order (map (Array (length array) length) (lambda . i . (get array (get order i)))))
(deftype part1 (Lambda (Or (Number))))
(defun part1 (do 
  (destructuring-bind ticket-ranges your-ticket nearby-tickets . (parse-input sample1))
  (go nearby-tickets (map (lambda x . . (select x (lambda y . . (not (some? ticket-ranges (lambda z . . (or (is-in-bounds y (car z)) (is-in-bounds y (car (cdr z))))))))))) (deep-flat) (summation))))
(deftype part2 (Lambda (Or (Number))))
(defun part2 (do 
  (destructuring-bind ticket-ranges your-ticket nearby-tickets . (parse-input sample2))
  (defconstant remaining (go nearby-tickets
                            (select (lambda x . .
                              (not (some? x (lambda y . .
                                (not (some? ticket-ranges (lambda z . .
                                  (or (is-in-bounds y (car z)) (is-in-bounds y (car (cdr z))))
                                  ))))))))))
  (defconstant tickets (push! (type remaining Array) (type your-ticket Array)))
  (defconstant *range* (range 0 (- (length your-ticket) 1)))
  (defun validate-ticket tickets i j (go 
        (every? tickets (lambda x . . 
          (do
              (or
                (is-in-bounds (get x i) (car (get ticket-ranges j)))
                (is-in-bounds (get x i) (car (cdr (get ticket-ranges j))))))))))
(loop defun seave tickets order (do
  (if (length tickets) (do
  (defconstant 
      current (car (car tickets))
      slot (car current)
      swap (car (cdr current))
      next (if (> (length tickets) 1) 
            (go 
              tickets 
              (cdr) 
              (map (lambda ti . . (select ti (lambda x . . (not (= (car (cdr x)) swap))))))) 
            ()))
  (push! order (Array slot swap))
  (seave next order)) order)))
(go 
  (go 
    (seave (go
    *range*
  (map (lambda x i r 
    (map r (lambda y j . 
      (Array i j (validate-ticket tickets i j))))))
    (map (lambda x . a (select x (lambda y . . (get y -1)))))
    (sort-by-len  *range*)) ())
    (select (lambda x . . (< (car (cdr x)) 6))) 
    (reduce (lambda a x . . (set a (car (cdr x)) (car x))) 
    (map (Array 20 length) (lambda x . . (or x -1)))) 
    (select (lambda x . . (not (= x -1))))) 
(map (lambda x . . (get your-ticket x)))
(product))))

(Array (part1) (part2))