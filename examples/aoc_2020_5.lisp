(import std "slice-if-index" "minimum" "maximum" "reduce" "floor" "round" "map" "push" "min" "max" "split-by" "quick-sort" "concat" "find-index")

; Start by considering the whole range, rows 0 through 127.
; F means to take the lower half, keeping rows 0 through 63.
; B means to take the upper half, keeping rows 32 through 63.
; F means to take the lower half, keeping rows 32 through 47.
; B means to take the upper half, keeping rows 40 through 47.
; B keeps rows 44 through 47.
; F keeps rows 44 through 45.
; The final F keeps the lower of the two, row 44.

; (defvar *sample* "FBFBBFFRLR
; BFFFBBFRRR
; FFFBBBFRRR
; BBFFBBFRLL")
(defconstant *sample* "BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL")
(deftype array-string-t (Array (String)))
(deftype array-number-t (Array (Number)))
(defconstant *input* *sample*)
; (defvar *input* (open "./playground/src/aoc_2020/5/input.txt"))
(defun binary_boarding inp bounds lower upper 
  (go inp 
      (check-type array-string-t)
      (reduce (lambda a b . . (do 
            (defconstant half (* (+ (car a) (car (cdr a))) 0.5))
            (cond 
                  (= b lower) (set a 1 (floor half))
                  (= b upper) (set a 0 (round half))))) bounds) 
      (get (= (get inp -1) upper))))

(defconstant *prepare-input* (go 
    *input* 
    (split-by "\n")
    (map (lambda directions . . (do 
      (defconstant 
            array (type directions Array)
            fb (binary_boarding (slice-if-index array (lambda i (< i 7))) (Array 0 127) "F" "B")
            lr (binary_boarding (slice-if-index array (lambda i (>= i 7))) (Array 0 7) "L" "R"))
      (+ (* fb 8) lr))))
      (check-type array-number-t)))

(defconstant *res1* (go 
      *prepare-input*
      (maximum)))

(defconstant *sorted* (go 
      *prepare-input*
      (quick-sort)))

(defconstant *minSeat* (minimum *sorted*))

(defconstant *res2* (go 
  *sorted*
  (find-index (lambda x i . (= (- x *minSeat* i) 1)))
  (+ *minSeat*)))

(Array *res1* *res2*)