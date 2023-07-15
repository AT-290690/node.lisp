(import std "push" "map" "reduce" "split-by")

(let sample "1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc")
; (let sample "3-4 b: jbmb")
; (let sample "2-3 f: fvwc")
(let *input* sample)
; (let *input* (open "./playground/src/aoc_2020/2/input.txt"))

(let *occ* (regex-match *input* "([0-9]{1,2}-[0-9]{1,2})"))
(let *policy* (regex-match *input* "[a-z](?=:)"))
(let *inputs* (regex-match *input* "(?<=:[ ])(.*)"))

(function occ_to_numbers x _ _ (do x (split-by "-") (map (lambda y _ _ (type y Number)))))

(function *solve1* string letter (block
  (declare 
    array (type string Array) 
    bitmask 0
    zero (char "a" 0)
    count 0
    has-at-least-one 0)
  (loop iterate i bounds  (block
      (declare 
        ch (get array i)
        code (- (char ch 0) zero)
        mask (<< 1 code))
      (if (and (if (= ch letter) (boole has-at-least-one 1))
          (not (= (& bitmask mask) 0))) 
          (let* count (+ count 1))
          (let* bitmask (| bitmask mask)))
      (if (< i bounds) (iterate (+ i 1) bounds) 
      (+ count has-at-least-one))))
      (iterate 0 (- (length array) 1))))

(function *solve2* array letter x y (block 
  (declare 
    a (get array (- x 1))
    b (get array (- y 1))
    left (= letter a)
    right (= letter b))
  (and (not (and left right)) (or left right))))

(Array 
(do *occ*
   (map occ_to_numbers)
   (map (lambda x i _ (do x 
            (push (get *policy* i)) 
            (push (get *inputs* i))
            (push (*solve1* (get x 3) (get x 2)))
            (push (and 
                    (>= (get x 4) (get x 0)) 
                    (<= (get x 4) (get x 1)))))))
  (reduce (lambda a x i o (+ a (get x -1))) 0)
  ; (map (lambda x i o (log x)))
)
(do *occ*
   (map occ_to_numbers)
   (map (lambda x i _ (do x 
            (push (get *policy* i)) 
            (push (get *inputs* i)))))
   (map (lambda x _ _ 
          (push x (*solve2* (type (get x 3) Array) (get x 2) (get x 0) (get x 1)))))
   (reduce (lambda a x _ _ (+ a (get x -1))) 0)
  ; (map (lambda x i o (log x)))
))

