(import std "map" "reduce" "floor")
(let sample 
"..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#")

(let input sample)

(function to_bit_array array 
  (map array (lambda line _ _ (do line 
                              (...) 
                              (map (lambda x _ _ 
                                    (if (= x "#") 1 0)))))))

(function solve array slopeX slopeY (block 
  (let h (length array))
  (let w (length (get array 0)))
  (do slopeY
      (/)
      (* h)
      (floor)
      (Array)
      (map (lambda _ index _ 
        (do array 
          (get (mod (* index slopeY) h)) 
          (get (mod (* index slopeX) w)))))
      (reduce (lambda a b _ _ (+ a b)) 0))))


(function task input (block 
(let matrix (do input 
            (format (esc "n")) 
            (to_bit_array)))
; 7 for sample
(log "-----------------")
(log "part 1")
(do matrix
  (solve 3 1) 
  (log)) 
; 336 for sample
(log "part 2")
(do 
(Array 
  (Array 1 1) 
  (Array 3 1) 
  (Array 5 1) 
  (Array 7 1) 
  (Array 1 2)) 
  (map (lambda x _ _ (solve matrix (get x 0) (get x 1))))
  (reduce (lambda a b _ _ (* a b)) 1)
  (log))))

(task sample)
