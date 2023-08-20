(import std "split-by-n-lines" "map" "split" "array-of-numbers" "push" "every" "reduce" "deep-flat" "remove" "some" "reverse"
"for-n" "rotate-left" "find" "slice-if-index" "for-each")
(import math "range" "product-array" "sum-array")

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

(deftype raw-t (Array (Array (String))))
(deftype ticket-ranges-t (Array (Array (Array (Number)))))
(deftype your-ticket-t (Array (Number)))
(deftype nearby-tickets-t (Array (Array (Number))))
(deftype groups-t (Array (Array (Array (Number)))))

(defun parse-input sample (do 
  (defconstant lines (go sample (split-by-n-lines 2)))
  (check-type lines raw-t)
  (defconstant ticket-ranges 
                      (go 
                        (car lines) 
                        (map (lambda x . . 
                            (map 
                              (split (car (cdr (split x ": "))) " or ") 
                                (lambda y . . 
                                  (go y 
                                    (split "-") 
                                    (array-of-numbers))))))))
(check-type ticket-ranges ticket-ranges-t)
(defconstant your-ticket (array-of-numbers (split (car (cdr (car (cdr lines)))) ",")))
(check-type your-ticket your-ticket-t)
(defconstant nearby-tickets (map (cdr (car (cdr (cdr lines)))) (lambda x . . (go x (split ",") (array-of-numbers)))))
(check-type nearby-tickets nearby-tickets-t)
(Array ticket-ranges your-ticket nearby-tickets)))

(defun is-in-bounds x rng (and (>= x (car rng)) (<= x (car (cdr rng)))))
(defun sort-by-len tickets r (map r (lambda x . . (find tickets (lambda y . . (= (- (length y) 1) x))))))
(defun order-array array order (map (Array (length array) length) (lambda . i . (get array (get order i)))))

(defun part1 (do 
  (defconstant *parsed-input* (parse-input sample1))
  (defconstant ticket-ranges (car *parsed-input*))
  (defconstant your-ticket (car (cdr *parsed-input*)))
  (defconstant nearby-tickets (car (cdr (cdr *parsed-input*))))
  (go nearby-tickets (map (lambda x . . (remove x (lambda y . . (not (some ticket-ranges (lambda z . . (or (is-in-bounds y (car z)) (is-in-bounds y (car (cdr z))))))))))) (deep-flat) (sum-array))))

(defun part2 (do 
  (defconstant *parsed-input* (parse-input sample2))
  (defconstant ticket-ranges (car *parsed-input*))
  (defconstant your-ticket (car (cdr *parsed-input*)))
  (defconstant nearby-tickets (car (cdr (cdr *parsed-input*))))
  (defconstant remaining (go nearby-tickets
                            (remove (lambda x . .
                              (not (some x (lambda y . .
                                (not (some ticket-ranges (lambda z . .
                                  (or (is-in-bounds y (car z)) (is-in-bounds y (car (cdr z))))))))))))))
  (defconstant tickets (push (type remaining Array) (type your-ticket Array)))
  (defun validate-ticket tickets i j (go 
        (every tickets (lambda x . . 
          (do
              (or
                (is-in-bounds (get x i) (car (get ticket-ranges j)))
                (is-in-bounds (get x i) (car (cdr (get ticket-ranges j))))))))))
(defconstant *range* (range 0 (- (length your-ticket) 1)))
(loop defun seave tickets order (do (void (check-type tickets groups-t)) 
  (if (length tickets) (do
  (defconstant 
      current (car (car tickets))
      slot (car current)
      swap (car (cdr current))
      next (if (> (length tickets) 1) 
            (go 
              tickets 
              (cdr) 
              (map (lambda ti . . (remove ti (lambda x . . (not (= (car (cdr x)) swap))))))) 
            ()))
  (push order (Array  slot swap))
  (seave next order)) order)))
(go 
  (go 
    (seave 
      (go
        *range*
        (map (lambda x i r 
          (map r (lambda y j . 
            (Array i j (validate-ticket tickets i j))))))
          (map (lambda x . a (remove x (lambda y . . (get y -1)))))
          (sort-by-len *range*))
     ()) 
    (remove (lambda x . . (< (car (cdr x)) 6))) 
    (reduce (lambda a x . . (set a (car (cdr x)) (car x))) 
    (map (Array 20 length) (lambda x . . (or x -1)))) 
    (remove (lambda x . . (not (= x -1))))) 
(map (lambda x . . (get your-ticket x)))
(product-array))))

(Array (part1) (part2))