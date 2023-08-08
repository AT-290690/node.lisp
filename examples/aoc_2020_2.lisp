(import std "push" "map" "reduce" "split-by")

(defconstant sample "1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc")
; (defvar sample "3-4 b: jbmb")
; (defvar sample "2-3 f: fvwc")
(deftype string-t (String))
(defconstant *input* sample)
; (defvar *input* (open "./playground/src/aoc_2020/2/input.txt"))
(defconstant *occ* (regex-match *input* "([0-9]{1,2}-[0-9]{1,2})"))
(defconstant *policy* (regex-match *input* "[a-z](?=:)"))
(defconstant *inputs* (regex-match *input* "(?<=:[ ])(.*)"))
(defun occ_to_numbers x . . (go x (check-type string-t) (split-by "-") (map (lambda y . . (type y Number)))))

(defun *solve1* string letter (do
  (defconstant 
    array (type string Array) 
    zero (char-code "a" 0))
  (defvar 
    count 0
    bitmask 0
    has-at-least-one 0)
  (loop defun iterate i bounds (do
      (defconstant 
        ch (get array i)
        code (- (char-code ch 0) zero)
        mask (<< 1 code))
      (if (and (when (= ch letter) (boole has-at-least-one 1))
          (not (= (& bitmask mask) 0))) 
          (setf count (+ count 1))
          (setf bitmask (| bitmask mask)))
      (if (< i bounds) (iterate (+ i 1) bounds) 
      (+ count has-at-least-one))))
      (iterate 0 (- (length array) 1))))

(defun *solve2* array letter x y (do 
  (defconstant 
    a (get array (- x 1))
    b (get array (- y 1))
    left (= letter a)
    right (= letter b))
  (and (not (and left right)) (or left right))))

(Array 
(go *occ*
   (map occ_to_numbers)
   (map (lambda x i . (go x 
            (push (get *policy* i)) 
            (push (get *inputs* i))
            (push (*solve1* (get x 3) (get x 2)))
            (push (and 
                    (>= (get x 4) (get x 0)) 
                    (<= (get x 4) (get x 1)))))))
  (reduce (lambda a x . . (+ a (get x -1))) 0)
  ; (map (lambda x i o (log x)))
)
(go *occ*
   (map occ_to_numbers)
   (map (lambda x i . (go x 
            (push (get *policy* i)) 
            (push (get *inputs* i)))))
   (map (lambda x . . 
          (push x (*solve2* (type (get x 3) Array) (get x 2) (get x 0) (get x 1)))))
   (reduce (lambda a x . . (+ a (get x -1))) 0)
  ; (map (lambda x i o (log x)))
))

