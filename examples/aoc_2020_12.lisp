(import std "split-by" "reduce"  "push" "map" "join" "reverse" "floor" "abs" "radians")
(let sample "F10
N3
F7
R90
F11")
(let *input* sample)
; (let *input* (open "./playground/src/aoc_2020/12/input.txt"))

(defun yoink stack (unless (not (length stack)) (block (let last (get stack -1)) (set stack -1) last)))
(defun move stack (let f (lambda (Array (yoink stack) f))))
; 362
(defun solve1 (block 

(defun normalize value min max (* (- value min) (/ (- max min))))
(let *stack* (do 
  *input* 
  (split-by "\n") 
  (push "F0") ; TODO delete this later
  (map (lambda x _ _
    (block 
      (let str (. x))
      (Array (car str) (do str (cdr) (join "") (type Number))))))
  (reverse)))

  (let 
    moves (. *stack*)
    cursor (apply (move moves))
    x 0
    y 0
    compass (Array "N" "E" "S" "W")
    arrow 1)
  (defun go (block 
    (let 
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
      (= action "N") (let* y (- y value))
      (= action "E") (let* x (+ x value))
      (= action "S") (let* y (+ y value))
      (= action "W") (let* x (- x value))
      (= action "L") (set moves (length moves) (Array (get compass (let* arrow (mod (- arrow (do value (normalize 0 90) (floor))) (length compass)))) 0))
      (= action "R") (set moves (length moves) (Array (get compass (let* arrow (mod (+ arrow (do value (normalize 0 90) (floor))) (length compass)))) 0))
      (= action "F") (set moves (length moves) (Array (get compass arrow) value)))
    (let* cursor (apply (car (cdr cursor))))))
  (defun next (if (length moves) (block (go) (next)) (block (go))))
  (next)
  (abs (+ x y))))

; 29895
(defun solve2 (block 

(defun factorial n (if (<= n 0) 1 (* n (factorial (- n 1)))))

(defun power base exp 
  (if (< exp 0) 
      (if (= base 0) 
      (error "Attempting to divide by 0 in (power)")
      (/ (* base (power base (- (* exp -1) 1))))) 
      (if (= exp 0) 1
        (if (= exp 1) base
          (* base (power base (- exp 1)))))))

(defun sin rad terms (block
    (let sine 0)
    (loop inc i 
    (block 
      (let* sine 
        (+ sine 
          (* 
            (/ (factorial (+ (* 2 i) 1))) 
            (power -1 i) 
            (power rad (+ (* 2 i) 1))))) 
      (if (< i terms) (inc (+ i 1)) sine)))
    (inc 0)))
   ; cos 
  (defun cos rad terms (block
    (let cosine 0)
    (loop inc i 
    (block 
      (let* cosine 
        (+ cosine 
          (* 
            (/ (factorial (* 2 i))) 
            (power -1 i) 
            (power rad  (* 2 i))))) 
      (if (< i terms) (inc (+ i 1)) cosine)))
    (inc 0)))

  (let *stack* (do 
    *input* 
    (split-by "\n") 
    (map (lambda x _ _ (block 
        (let str (. x))
        (Array (car str) (do str (cdr) (join "") (type Number))))))
    (reverse)))
  (let 
    moves (. *stack*)
    cursor (apply (move moves))
    x 0
    y 0
    dx 10
    dy 1
    TERM 17
    compass (Array "N" "E" "S" "W"))
  (defun go (block 
    (let 
      action (car (car cursor))
      value (car (cdr (car cursor))))
    ; (log (Array action value (Array x y) (Array dx dy)))
    ; F10 moves the ship to the waypoint 10 times (a total of 100 units east and 10 units north), leaving the ship at east 100, north 10. The waypoint stays 10 units east and 1 unit north of the ship.
    ; N3 moves the waypoint 3 units north to 10 units east and 4 units north of the ship. The ship remains at east 100, north 10.
    ; F7 moves the ship to the waypoint 7 times (a total of 70 units east and 28 units north), leaving the ship at east 170, north 38. The waypoint stays 10 units east and 4 units north of the ship.
    ; R90 rotates the waypoint around the ship clockwise 90 degrees, moving it to 4 units east and 10 units south of the ship. The ship remains at east 170, north 38.
    ; F11 moves the ship to the waypoint 11 times (a total of 44 units east and 110 units south), leaving the ship at east 214, south 72. The waypoint stays 4 units east and 10 units south of the ship.
    (cond 
      (= action "N") (let* dy (+ dy value))
      (= action "E") (let* dx (+ dx value))
      (= action "S") (let* dy (- dy value))
      (= action "W") (let* dx (- dx value))
      (= action "L") (block 
                    (let 
                      rad (radians value)
                      dx1 (- (* dx (cos rad TERM)) (* dy (sin rad TERM)))
                      dy1 (+ (* dx (sin rad TERM)) (* dy (cos rad TERM))))
                    (let* dx dx1)
                    (let* dy dy1))
      (= action "R") (block
                    (let 
                      rad (- (radians value))
                      dx1 (- (* dx (cos rad TERM)) (* dy (sin rad TERM)))
                      dy1 (+ (* dx (sin rad TERM)) (* dy (cos rad TERM))))
                    (let* dx dx1)
                    (let* dy dy1))
      (= action "F") (block 
                  (let* x (+ x (* dx value))) 
                  (let* y (+ y (* dy value)))))
    (let* cursor (apply (car (cdr cursor))))))
  (defun next (if (length moves) (block (go) (next)) (block (go))))
  (next)
  (+ (abs x) (abs y))))

(Array (solve1) (solve2))