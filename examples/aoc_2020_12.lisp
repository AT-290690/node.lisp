(import std "reduce" "push!" "map" "reverse")
(import str "split-by" "join")
(import math "abs" "radians" "floor")
(defconstant sample "F10
N3
F7
R90
F11")
(defconstant *input* sample)
; (defvar *input* (:open "./playground/src/aoc_2020/12/input.txt"))
; (deftype array-number-t (Array (Number)))
; (deftype stack-t (Array (Array (String) (Number))))
; (deftype lazy-cmd-t (Array (Array (String) (Number)) (Function)))
(defun drop! stack (when (length stack) (do (defconstant last (get stack -1)) (set stack -1) last)))

(deftype move (Lambda (Or (Array (Array (String) (Number)))) (Or (Function))))
(defun move stack (defconstant f (lambda (Array (drop! stack) f))))
; 362
(deftype solve1 (Lambda (Or (Number))))
(defun solve1 (do 
  (defun normalize value min max (* (- value min) (/ (- max min))))
  (defconstant *stack* (go 
    *input* 
    (split-by "\n")
    (push! "F0") ; TODO delete this later
    (map (lambda x . .
      (do 
        (defvar str (type x Array))
        (Array (car str) (go str (cdr) (join "") (type Number))))))
    (reverse)))
    (defconstant 
      moves (type *stack* Array)
      compass (Array "N" "E" "S" "W"))
    (defvar
      x 0
      y 0
      cursor (apply (move moves))
      arrow 1)
    (defun lazy (do 
      (defconstant 
        action (car (car cursor))
        value (car (cdr (car cursor))))
      ; (log (Array action value (Array x y)))
      ; Action N means to move north by the given value.
      ; Action S means to move south by the given value.
      ; Action E means to move east by the given value.
      ; Action W means to move west by the given value.
      ; Action L means to turn left the given number of degrees.
      ; Action R means to turn right the given number of degrees.
      ; Action F means to move forward by the given value in the direction the ship is currently facing.
      (cond 
        (= action "N") (setf y (- y value))
        (= action "E") (setf x (+ x value))
        (= action "S") (setf y (+ y value))
        (= action "W") (setf x (- x value))
        (= action "L") (push! moves (Array (get compass (setf arrow (mod (- arrow (go value (normalize 0 90) (floor))) (length compass)))) 0))
        (= action "R") (push! moves (Array (get compass (setf arrow (mod (+ arrow (go value (normalize 0 90) (floor))) (length compass)))) 0))
        (= action "F") (push! moves (Array (get compass arrow) value)))
      (setf cursor (apply (car (cdr cursor))))
      ))
    (defun next (if (length moves) (do (lazy) (next)) (do (lazy))))
    (next)
    (abs (+ x y))))




  ; 29895
  (deftype solve2 (Lambda (Or (Number))))
  (defun solve2 (do 

  (deftype factorial (Lambda (Or (Number)) (Or (Number))))
  (defun factorial n (if (<= n 0) 1 (* n (factorial (- n 1)))))

  (deftype power (Lambda (Or (Number)) (Or (Number)) (Or (Number))))
  (defun power base exp 
    (if (< exp 0) 
        (if (= base 0) 
        (throw "Attempting to divide by 0 in (power)")
        (/ (* base (power base (- (* exp -1) 1))))) 
        (if (= exp 0) 1
          (if (= exp 1) base
            (* base (power base (- exp 1)))))))

  (deftype sin (Lambda (Or (Number)) (Or (Number)) (Or (Number))))
  (defun sin rad terms (do
      (defvar sine 0)
      (loop defun inc i 
      (do 
        (setf sine 
          (+ sine 
            (* 
              (/ (factorial (+ (* 2 i) 1))) 
              (power -1 i) 
              (power rad (+ (* 2 i) 1))))) 
        (if (< i terms) (inc (+ i 1)) sine)))
      (inc 0)))
    ; cos 
    (deftype cos (Lambda (Or (Number)) (Or (Number)) (Or (Number))))
    (defun cos rad terms (do
      (defvar cosine 0)
      (loop defun inc i 
      (do 
        (setf cosine 
          (+ cosine 
            (* 
              (/ (factorial (* 2 i))) 
              (power -1 i) 
              (power rad  (* 2 i))))) 
        (if (< i terms) (inc (+ i 1)) cosine)))
      (inc 0)))

    (defconstant *stack* (go 
      *input* 
      (split-by "\n") 
      (map (lambda x . . (do 
          (defconstant str (type x Array))
          (Array (car str) (go str (cdr) (join "") (type Number))))))
      (reverse)))
    (defconstant 
      moves (type *stack* Array)
      TERM 17
      compass (Array "N" "E" "S" "W"))
    (defvar 
      cursor (apply (move moves))
      x 0
      y 0
      dx 10
      dy 1)
    (defun lazy (do 
      (defconstant 
        action (car (car cursor))
        value (car (cdr (car cursor))))
      ; (log (Array action value (Array x y) (Array dx dy)))
      ; F10 moves the ship to the waypoint 10 times (a total of 100 units east and 10 units north), leaving the ship at east 100, north 10. The waypoint stays 10 units east and 1 unit north of the ship.
      ; N3 moves the waypoint 3 units north to 10 units east and 4 units north of the ship. The ship remains at east 100, north 10.
      ; F7 moves the ship to the waypoint 7 times (a total of 70 units east and 28 units north), leaving the ship at east 170, north 38. The waypoint stays 10 units east and 4 units north of the ship.
      ; R90 rotates the waypoint around the ship clockwise 90 degrees, moving it to 4 units east and 10 units south of the ship. The ship remains at east 170, north 38.
      ; F11 moves the ship to the waypoint 11 times (a total of 44 units east and 110 units south), leaving the ship at east 214, south 72. The waypoint stays 4 units east and 10 units south of the ship.
      (cond 
        (= action "N") (setf dy (+ dy value))
        (= action "E") (setf dx (+ dx value))
        (= action "S") (setf dy (- dy value))
        (= action "W") (setf dx (- dx value))
        (= action "L") (do 
                      (defconstant 
                        rad (radians value)
                        dx1 (- (* dx (cos rad TERM)) (* dy (sin rad TERM)))
                        dy1 (+ (* dx (sin rad TERM)) (* dy (cos rad TERM))))
                      (setf dx dx1)
                      (setf dy dy1))
        (= action "R") (do
                      (defconstant 
                        rad (- (radians value))
                        dx1 (- (* dx (cos rad TERM)) (* dy (sin rad TERM)))
                        dy1 (+ (* dx (sin rad TERM)) (* dy (cos rad TERM))))
                      (setf dx dx1)
                      (setf dy dy1))
        (= action "F") (do 
                    (setf x (+ x (* dx value))) 
                    (setf y (+ y (* dy value)))))
      (setf cursor (apply (car (cdr cursor))))))
    (deftype next (Lambda (Or (Array (Array (String) (Number)))) (Array (Array (String) (Number)))))
    (defun next moves (if (length moves) (do (lazy) (next moves)) (do (lazy))))
    (next moves)
    (+ (abs x) (abs y))))

  (Array (solve1) (solve2))