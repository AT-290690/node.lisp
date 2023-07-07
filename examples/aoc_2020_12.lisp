(import std "split-by" "reduce"  "push" "map" "manhattan-distance" "join" "reverse")
(let sample "F10
N3
F7
R90
F11")

(let *input* sample)
; (let *input* (open "./playground/src/aoc_2020/12/input.txt"))

(let *stack* (do 
  *input* 
  (split-by "\n") 
  (map (lambda x _ _ 
    (block 
      (let str (. x))
      (Array (car str) (do str (cdr) (join "") (type Number)))))) 
  (reverse)))
(function yoink stack (unless (not (length stack)) (block (let last (get stack -1)) (set stack -1) last)))
(function move stack (let f (lambda (Array (yoink stack) f))))
(function solve1 (block 
  (let moves (. *stack*))
  (let cursor (identity (move moves)))
  (let x 0)
  (let y 0)
  (let compass (Array "N" "E" "S" "W"))
  (let arrow 1)
  (function go (block 
    (let action (car (car cursor)))
    (let value (car (cdr (car cursor))))
    (log action value (Array x y))
  ; Action N means to move north by the given value.
  ; Action S means to move south by the given value.
  ; Action E means to move east by the given value.
  ; Action W means to move west by the given value.
  ; Action L means to turn left the given number of degrees.
  ; Action R means to turn right the given number of degrees.
  ; Action F means to move forward by the given value in the direction the ship is currently facing.
    (if (= action "N") (block (let* y (- y value)) (let* arrow 0))
      (if (= action "E") (block (let* x (+ x value)) (let* arrow 1))  
        (if (= action "S") (block (let* y (+ y value)) (let* arrow 2))
          (if (= action "W") (block (let* x (- x value)) (let* arrow 3)) 
            (if (= action "L") (set moves (length moves) (Array (get compass (- arrow value)) 0))
              (if (= action "R") (set moves (length moves) (Array (get compass (+ arrow value)) 0))
                (if (= action "F") (set moves (length moves) (Array (get compass arrow) value)))))))))
    (let* cursor (identity (car (cdr cursor))))))
  (function next (if (length moves) (sleep 10 (lambda (block (go) (next)))) (block (go))))
  (next)))
(solve1)