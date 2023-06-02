(function push array value (set array (length array) value))
(function map array callback (block 
  (let new_array (Array 0))
  (let i 0)
  (loop iterate i bounds (block
    (set new_array i (callback (get array i) i array))
    (if (< i bounds) (iterate (+ i 1) bounds) new_array)))
  (iterate 0 (- (length array) 1))))
(function reduce array callback initial (block
  (loop iterate i bounds (block
    (let* initial (callback initial (get array i) i array))
    (if (< i bounds) (iterate (+ i 1) bounds) initial)))
  (iterate 0 (- (length array) 1))))

(let sample "1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc")

(let input sample)

(let occ (regex_match input "([0-9]{1,2}-[0-9]{1,2})"))
(let policy (regex_match input "[a-z](?=:)"))
(let inputs (regex_match input "(?<=:[ ])(.*)"))

(function solve1 string letter (block
  (let array (... string))
  (let bitmask 0)
  (let zero (char "a" 0))
  (let count 0)
  (let has_at_least_one 0)
  (loop iterate i bounds  (block
      (let ch (get array i))
      (let code (- (char ch 0) zero))
      (let mask (<< 1 code))
      (if (and (if (= ch letter) (let* has_at_least_one 1))
          (not (= (& bitmask mask) 0))) 
          (let* count (+ count 1))
          (let* bitmask (| bitmask mask)))
      (if (< i bounds) (iterate (+ i 1) bounds) 
      (+ count has_at_least_one))))
      (iterate 0 (- (length array) 1))))
(do occ
  (map (lambda x i o
              (do x
                (format "-") 
                (map (lambda y i o (type Number y))))))
   (map (lambda x i o (do x 
            (push (get policy i)) 
            (push (get inputs i))
            (push (solve1 (get x 3) (get x 2)))
            (push (and 
                    (>= (get x 4) (get x 0)) 
                    (<= (get x 4) (get x 1)))))))
  (reduce (lambda a x i o (+ a (get x -1))) 0)
  (log)
  ; (map (lambda x i o (log x)))
)

(function solve2 array letter x y (block 
(let a (get array (- x 1)))
(let b (get array (- y 1)))
(let left (= letter a))
(let right (= letter b))
(and (not (and left right)) (or left right))))

(do occ
  (map (lambda x i o (do x (format "-") (map (lambda y i o (` y))))))
   (map (lambda x i o (do x 
            (push (get policy i)) 
            (push (get inputs i)))))
   (map (lambda x i o 
    (push x (solve2 (... (get x 3)) (get x 2) (get x 0) (get x 1)))))
   (reduce (lambda a x i o (+ a (get x -1))) 0)
  (log)
  ; (map (lambda x i o (log x)))
)