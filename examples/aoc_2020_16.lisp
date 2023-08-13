(import std "split-by-n-lines" "map" "split" "array-of-numbers" "push" "every" "find" "some" "reduce" "for-each" "remove" "deep-flat" "sum-array")

(defconstant sample "class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12")

(deftype raw-t (Array (Array (String))))
(deftype ticket-ranges-t (Array (Array (Array (Number) (Number)))))
(deftype your-ticket-t (Array (Number)))
(deftype nearby-tickets-t (Array (Array (Number))))

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
; (go ticket-ranges (map (lambda x . . (log x))))
(defconstant your-ticket (array-of-numbers (split (car (cdr (car (cdr lines)))) ",")))
; (log your-ticket)
(check-type your-ticket your-ticket-t)
(defconstant nearby-tickets (map (cdr (car (cdr (cdr lines)))) (lambda x . . (go x (split ",") (array-of-numbers)))))
; (log nearby-tickets)
(check-type nearby-tickets nearby-tickets-t)
(defun is-in-bounds x rng (and (>= x (car rng)) (<= x (car (cdr rng)))))
(Array 
  (go nearby-tickets (map (lambda x . . (remove x (lambda y . . (not (some ticket-ranges (lambda z . . (or (is-in-bounds y (car z)) (is-in-bounds y (car (cdr z))))))))))) (deep-flat) (sum-array)))
