(import std "neighborhood" "split-by" "split-by-lines" "for-n" "for-each" "deep-flat" "array-of-numbers" "reduce" "max" "quick-sort" "map" "concat" "push" "adjacent-difference" "count-of" "join" "array-in-bounds-p")
(defvar sample 
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
(defvar *input* sample)
; (defvar *input* (open "./playground/src/aoc_2020/11/input.txt"))
(defun count-seats matrix (do
  (reduce matrix (lambda a row . . (+ a (count-of row (lambda x . . (> x 0))))) 0)))

(defun parse-input input (trace 
  input
  (split-by-lines)
  (map (lambda row . . 
    (trace row 
      (type Array) 
      (map (lambda col . . (- (= col "L") 1))))))))

(defun solve-1 matrix tolerance (do 
  (defvar 
    height (- (length matrix) 1)
    width (- (length (car matrix)) 1)
    directions (Array (Array 0 1) (Array 1 0) (Array -1 0) (Array 0 -1) (Array 1 -1) (Array -1 -1) (Array 1 1) (Array -1 1))
    copy (map (Array (+ height 1) length) (lambda . . . (Array (+ width 1) length))))
  (for-n height (lambda y 
    (for-n width (lambda x (do 
      (defvar current (get (get matrix y) x)
        sum (neighborhood matrix directions y x (lambda neighbor . (and (not (= neighbor -1)) neighbor))))
      (set (get copy y) x 
        (if (and (= sum 0) (= current 0)) 1
          (if (and (>= sum tolerance) (= current 1)) 0 current))))))))
          copy))
          
(defun solve-2 matrix tolerance (do 
  (defvar 
    height (- (length matrix) 1)
    width (- (length (car matrix)) 1)
    copy (map (Array (+ height 1) length) (lambda . . . (Array (+ width 1) length)))
    directions (Array (Array 0 1) (Array 1 0) (Array -1 0) (Array 0 -1) (Array 1 -1) (Array -1 -1) (Array 1 1) (Array -1 1)))
  (for-n height (lambda y 
    (for-n width (lambda x 
      (do 
        (defvar current (get (get matrix y) x))
        (defvar sum 0)
        (loop defun seek-seat Y X i (do 
              (defvar dy (+ y (* Y i)))
              (defvar dx (+ x (* X i)))
              (if (and (array-in-bounds-p matrix dy) (array-in-bounds-p (get matrix dy) dx)) 
                (do 
                  (defvar seat (get (get matrix dy) dx))
                  (if (= seat -1) (seek-seat Y X (+ i 1))
                  (if (= seat 1) (setf sum (+ sum seat))))
                ))))
        (for-each directions (lambda dir . . (seek-seat (car dir) (car (cdr dir)) 1)))
          ; L = 0
          ; # = 1
          ; . = -1
          ; (defvar moore (lambda neighbor . (and (not (= neighbor -1)) neighbor)))
          (set (get copy y) x 
            (if (and (= sum 0) (= current 0)) 1
              (if (and (>= sum tolerance) (= current 1)) 0 current))))))))
              copy))

(defun format-matrix matrix (trace matrix 
                                  (map (lambda row . . 
                                    (trace row 
                                      (map (lambda col . . (if (= col 1) "#" (if (= col 0) "L"  "."))))
                                      (join ""))))
                                  (join "\n")))

(defun print-matrix matrix (and (log (format-matrix matrix)) matrix))

(defvar *matrix* (parse-input *input*))

; (log "----------")
; (log "PART 1")
; (log (format-matrix *matrix*))
; (log "\n----------")
; (trace *matrix* 
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

  
  ; (trace 
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
; (trace *matrix* 
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

  (loop defun rotate matrix prev n (do 
    (defvar next-matrix (if n (solve-2 matrix 5) (solve-1 matrix 4)))
    (defvar next (count-seats next-matrix))
    (unless (= prev next) 
      (rotate next-matrix next n)
      next)))

(Array (trace *matrix* (rotate -1 0)) (trace *matrix* (rotate -1 1)))