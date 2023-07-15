(import std "neighborhood" "split-by" "split-by-lines" "for-n" "for-each" "deep-flat" "array-of-numbers" "reduce" "max" "quick-sort" "map" "concat" "push" "adjacent-difference" "count-of" "join" "array-in-bounds-p")
(let sample 
"L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL")
(let *input* sample)
; (let *input* (open "./playground/src/aoc_2020/11/input.txt"))
(function count-seats matrix (block
  (reduce matrix (lambda a row _ _ (+ a (count-of row (lambda x _ _ (> x 0))))) 0)))

(function parse-input input (do 
  input
  (split-by-lines)
  (map (lambda row _ _ 
    (do row 
      (type Array) 
      (map (lambda col _ _ (- (= col "L") 1))))))))

(function solve-1 matrix tolerance (block 
  (declare 
    height (- (length matrix) 1)
    width (- (length (car matrix)) 1)
    directions (Array (Array 0 1) (Array 1 0) (Array -1 0) (Array 0 -1) (Array 1 -1) (Array -1 -1) (Array 1 1) (Array -1 1))
    copy (map (Array (+ height 1) length) (lambda _ _ _ (Array (+ width 1) length))))
  (for-n height (lambda y 
    (for-n width (lambda x (block 
      (declare current (get (get matrix y) x)
        sum (neighborhood matrix directions y x (lambda neighbor _ (and (not (= neighbor -1)) neighbor))))
      (set (get copy y) x 
        (if (and (= sum 0) (= current 0)) 1
          (if (and (>= sum tolerance) (= current 1)) 0 current))))))))
          copy))
          
(function solve-2 matrix tolerance (block 
  (declare 
    height (- (length matrix) 1)
    width (- (length (car matrix)) 1)
    copy (map (Array (+ height 1) length) (lambda _ _ _ (Array (+ width 1) length)))
    directions (Array (Array 0 1) (Array 1 0) (Array -1 0) (Array 0 -1) (Array 1 -1) (Array -1 -1) (Array 1 1) (Array -1 1)))
  (for-n height (lambda y 
    (for-n width (lambda x 
      (block 
        (let current (get (get matrix y) x))
        (let sum 0)
        (loop seek-seat Y X i (block 
              (let dy (+ y (* Y i)))
              (let dx (+ x (* X i)))
              (if (and (array-in-bounds-p matrix dy) (array-in-bounds-p (get matrix dy) dx)) 
                (block 
                  (let seat (get (get matrix dy) dx))
                  (if (= seat -1) (seek-seat Y X (+ i 1))
                  (if (= seat 1) (let* sum (+ sum seat))))
                ))))
        (for-each directions (lambda dir _ _ (seek-seat (car dir) (car (cdr dir)) 1)))
          ; L = 0
          ; # = 1
          ; . = -1
          ; (let moore (lambda neighbor _ (and (not (= neighbor -1)) neighbor)))
          (set (get copy y) x 
            (if (and (= sum 0) (= current 0)) 1
              (if (and (>= sum tolerance) (= current 1)) 0 current))))))))
              copy))

(function format-matrix matrix (do matrix 
                                  (map (lambda row _ _ 
                                    (do row 
                                      (map (lambda col _ _ (if (= col 1) "#" (if (= col 0) "L"  "."))))
                                      (join ""))))
                                  (join "\n")))

(function print-matrix matrix (and (log (format-matrix matrix)) matrix))

(let *matrix* (parse-input *input*))

; (log "----------")
; (log "PART 1")
; (log (format-matrix *matrix*))
; (log "\n----------")
; (do *matrix* 
;   (solve-1 4) 
;   (print-matrix) 
;   (solve-1 4)
;   (print-matrix) 
;   (solve-1 4)
;   (print-matrix)
;   (solve-1 4)
;   (print-matrix)
;   (solve-1 4)
;   (print-matrix))
; (log "\n----------")

  
  ; (do 
  ; *matrix* 
  ; (solve-1 4) 
  ; (solve-1 4)
  ; (solve-1 4)
  ; (solve-1 4)
  ; (solve-1 4)
  ; (count-seats -1)
  ; (log))

; (log "----------")
; (log "PART 2")
; (log (format-matrix *matrix*))
; (log "\n----------")
; (do *matrix* 
;   (solve-2 5) 
;   (print-matrix) 
;   (solve-2 5) 
;   (print-matrix) 
;   (solve-2 5)
;   (print-matrix) 
;   (solve-2 5)
;   (print-matrix)
;   (solve-2 5)
;   (print-matrix)
;   (solve-2 5)
;   (print-matrix)
;   )
; (log "\n----------")

  (loop rotate matrix prev n (block 
    (let next-matrix (if n (solve-2 matrix 5) (solve-1 matrix 4)))
    (let next (count-seats next-matrix))
    (unless (= prev next) 
      (rotate next-matrix next n)
      next)))

(Array (do *matrix* (rotate -1 0)) (do *matrix* (rotate -1 1)))