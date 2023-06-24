(import std "reduce" "floor" "round" "map" "push" "min" "max" "split-by" "quick-sort" "concat" "find-index")

; Start by considering the whole range, rows 0 through 127.
; F means to take the lower half, keeping rows 0 through 63.
; B means to take the upper half, keeping rows 32 through 63.
; F means to take the lower half, keeping rows 32 through 47.
; B means to take the upper half, keeping rows 40 through 47.
; B keeps rows 44 through 47.
; F keeps rows 44 through 45.
; The final F keeps the lower of the two, row 44.

(let sample "FBFBBFFRLR
BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL")
(let input sample)
; (let input (open "./playground/src/aoc_2020/5/input.txt"))
(function to_fb array (reduce array (lambda a b i _ (if (< i 7) (push a b) a)) (Array 0 length)))
(function to_lr array (reduce array (lambda a b i _ (if (>= i 7) (push a b) a)) (Array 0 length)))
(function binary_boarding inp bounds lower upper (do inp 
    (reduce (lambda a b _ _ (block 
    (let half (* (+ (get a 0) (get a 1)) 0.5))
    (if (= b lower) (set a 1 (floor half))
    (if (= b upper) (set a 0 (round half)))))) bounds) 
    (get (= (get inp -1) upper))))

(function calc fb lr 
  (+ (* (binary_boarding fb (Array 0 127) "F" "B") 8) 
        (binary_boarding lr (Array 0 7) "L" "R")))

(let res1 (do input 
    (split-by "\n")
    (map (lambda x _ _ (block 
      (let arr (... x))
      (calc (to_fb arr) (to_lr arr)))))
      (reduce (lambda a b _ _  (max a b)) 0)))

(let sorted (do input 
    (split-by "\n")
    (map (lambda x _ _ (block 
      (let arr (... x))
      (calc (to_fb arr) (to_lr arr)))))
      (quick-sort)))

(let maxSeat (reduce sorted (lambda a b _ _  (max a b)) 0))
(let minSeat (reduce sorted (lambda a b _ _  (min a b)) maxSeat))

(Array res1 
  (do 
  sorted
  (find-index (lambda x i _ (= (- x minSeat i) 1)))
  (+ minSeat)))