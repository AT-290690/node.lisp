(import std "split-by" "reduce"  "push" "map" "join" "reverse" "floor" "abs")
(let sample "F10
N3
F7
R90
F11")
(let *input* sample)
; (let *input* (open "./playground/src/aoc_2020/12/input.txt"))

(function yoink stack (unless (not (length stack)) (block (let last (get stack -1)) (set stack -1) last)))
(function move stack (let f (lambda (Array (yoink stack) f))))
; 362
(function solve1 (block 

(function normalize value min max (* (- value min) (/ (- max min))))
(let *stack* (do 
  *input* 
  (split-by "\n") 
  (push "F0") ; TODO delete this later
  (map (lambda x _ _
    (block 
      (let str (. x))
      (Array (car str) (do str (cdr) (join "") (type Number))))))
  (reverse)))

  (let moves (. *stack*))
  (let cursor (apply (move moves)))
  (let x 0)
  (let y 0)
  (let compass (Array "N" "E" "S" "W"))
  (let arrow 1)
  (function go (block 
    (let action (car (car cursor)))
    (let value (car (cdr (car cursor))))
    ; (log (Array action value (Array x y)))
    ; Action N means to move north by the given value.
    ; Action S means to move south by the given value.
    ; Action E means to move east by the given value.
    ; Action W means to move west by the given value.
    ; Action L means to turn left the given number of degrees.
    ; Action R means to turn right the given number of degrees.
    ; Action F means to move forward by the given value in the direction the ship is currently facing.
    (if (= action "N") (block (let* y (- y value)))
      (if (= action "E") (block (let* x (+ x value)))
        (if (= action "S") (block (let* y (+ y value)))
          (if (= action "W") (block (let* x (- x value)))
            (if (= action "L") (set moves (length moves) (Array (get compass (let* arrow (mod (- arrow (do value (normalize 0 90) (floor))) (length compass)))) 0))
              (if (= action "R") (set moves (length moves) (Array (get compass (let* arrow (mod (+ arrow (do value (normalize 0 90) (floor))) (length compass)))) 0))
                (if (= action "F") (set moves (length moves) (Array (get compass arrow) value)))))))))
    (let* cursor (apply (car (cdr cursor))))))
  (function next (if (length moves) (block (go) (next)) (block (go))))
  (next)
  (abs (+ x y))))

; 29895
(function solve2 (block 

(function factorial n (if (<= n 0) 1 (* n (factorial (- n 1)))))

(function power base exp 
  (if (< exp 0) 
      (if (= base 0) 
      (error "Attempting to divide by 0 in (power)")
      (/ (* base (power base (- (* exp -1) 1))))) 
      (if (= exp 0) 1
        (if (= exp 1) base
          (* base (power base (- exp 1)))))))

(function sin rad terms (block
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
  (function cos rad terms (block
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
  (let moves (. *stack*))
  (let cursor (apply (move moves)))
  (let x 0)
  (let y 0)
  (let dx 10)
  (let dy 1)
  (let TERM 17)
  (let compass (Array "N" "E" "S" "W"))
  (function go (block 
    (let action (car (car cursor)))
    (let value (car (cdr (car cursor))))
    ; (log (Array action value (Array x y) (Array dx dy)))
    ; F10 moves the ship to the waypoint 10 times (a total of 100 units east and 10 units north), leaving the ship at east 100, north 10. The waypoint stays 10 units east and 1 unit north of the ship.
    ; N3 moves the waypoint 3 units north to 10 units east and 4 units north of the ship. The ship remains at east 100, north 10.
    ; F7 moves the ship to the waypoint 7 times (a total of 70 units east and 28 units north), leaving the ship at east 170, north 38. The waypoint stays 10 units east and 4 units north of the ship.
    ; R90 rotates the waypoint around the ship clockwise 90 degrees, moving it to 4 units east and 10 units south of the ship. The ship remains at east 170, north 38.
    ; F11 moves the ship to the waypoint 11 times (a total of 44 units east and 110 units south), leaving the ship at east 214, south 72. The waypoint stays 4 units east and 10 units south of the ship.
    (if (= action "N") (block (let* dy (+ dy value)))
      (if (= action "E") (block (let* dx (+ dx value)))
        (if (= action "S") (block (let* dy (- dy value)))
          (if (= action "W") (block (let* dx (- dx value)))
            (if (= action "L") (block 
                    (let rad (radians value))
                    (let dx1 (- (* dx (cos rad TERM)) (* dy (sin rad TERM))))
                    (let dy1 (+ (* dx (sin rad TERM)) (* dy (cos rad TERM))))
                    (let* dx dx1)
                    (let* dy dy1))
                (if (= action "R") (block
                    (let rad (- (radians value)))
                    (let dx1 (- (* dx (cos rad TERM)) (* dy (sin rad TERM))))
                    (let dy1 (+ (* dx (sin rad TERM)) (* dy (cos rad TERM))))
                    (let* dx dx1)
                    (let* dy dy1))
                (if (= action "F") (block 
                  (let* x (+ x (* dx value))) 
                  (let* y (+ y (* dy value)))))))))))
    (let* cursor (apply (car (cdr cursor))))))
  (function next (if (length moves) (block (go) (next)) (block (go))))
  (next)
  (+ (abs x) (abs y))))

(Array (solve1) (solve2))