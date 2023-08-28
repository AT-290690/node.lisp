(import std "neighborhood" "split-by" "split-by-lines" "for-n" "for-each" "array-of-numbers" "reduce" "quick-sort" "map" "concat" "push" "count-of" "join" "array-in-bounds-p")
(import math "max")
(defconstant sample 
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
; (deftype matrix-t (Array (Array (Number))))
; (deftype input-t (String))
(defconstant *input* sample)
; (defconstant *input* (:open "./playground/src/aoc_2020/11/input.txt"))
(deftype count-seats (Lambda (Or (Array (Array (Number)))) (Or (Number))))
(defun count-seats matrix (reduce matrix (lambda a row . . (+ a (count-of row (lambda x . . (> x 0))))) 0))
(deftype parse-input (Lambda (Or (String)) (Or (Array (Array (Number))))))
(defun parse-input input (go 
  input
  (split-by-lines)
  (map (lambda row . . 
    (go row 
      (type Array) 
      (map (lambda col . . (- (= col "L") 1))))))))

(deftype solve-1 (Lambda (Or (Array (Array (Number)))) (Or (Number)) (Or (Array (Array (Number))))))
(defun solve-1 matrix tolerance (do 
  (defconstant 
    height (- (length matrix) 1)
    width (- (length (car matrix)) 1)
    directions (Array (Array 0 1) (Array 1 0) (Array -1 0) (Array 0 -1) (Array 1 -1) (Array -1 -1) (Array 1 1) (Array -1 1))
    copy (map (Array (+ height 1) length) (lambda . . . (Array (+ width 1) length))))
  (for-n height (lambda y 
    (for-n width (lambda x (do 
      (defconstant 
        current (get (get matrix y) x)
        sum (neighborhood matrix directions y x (lambda neighbor . (and (not (= neighbor -1)) neighbor))))
      (set (get copy y) x 
        (if (and (= sum 0) (= current 0)) 1
          (if (and (>= sum tolerance) (= current 1)) 0 current))))))))
          copy))
(deftype solve-2 (Lambda (Or (Array (Array (Number)))) (Or (Number)) (Or (Array (Array (Number))))))
(defun solve-2 matrix tolerance (do 
  (defconstant 
    height (- (length matrix) 1)
    width (- (length (car matrix)) 1)
    copy (map (Array (+ height 1) length) (lambda . . . (Array (+ width 1) length)))
    directions (Array (Array 0 1) (Array 1 0) (Array -1 0) (Array 0 -1) (Array 1 -1) (Array -1 -1) (Array 1 1) (Array -1 1)))
  (for-n height (lambda y 
    (for-n width (lambda x 
      (do 
        (defconstant current (get (get matrix y) x))
        (defvar sum 0)
        (loop defun seek-seat Y X i (do 
              (defconstant 
                dy (+ y (* Y i))
                dx (+ x (* X i)))
              (when (and (array-in-bounds-p matrix dy) (array-in-bounds-p (get matrix dy) dx)) 
                (do 
                  (defconstant seat (get (get matrix dy) dx))
                  (cond 
                    (= seat -1) (seek-seat Y X (+ i 1))
                    (= seat 1) (setf sum (+ sum seat)))
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

(defun format-matrix matrix (go matrix
                                  (map (lambda row . . 
                                    (go row 
                                      (map (lambda col . . 
                                        (or 
                                          (cond 
                                            (= col 1) "#" 
                                            (= col 0) "L")
                                        ".")))
                                      (join ""))))
                                  (join "\n")))

(defun print-matrix matrix (and (log (format-matrix matrix)) matrix))

(defconstant *matrix* (parse-input *input*))
; (log "----------")
; (log "PART 1")
; (log (format-matrix *matrix*))
; (log "\n----------")
; (go *matrix* 
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

  
  ; (go 
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
; (go *matrix* 
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
  
  (deftype rotate (Lambda (Or (Array (Array (Number)))) (Or (Number)) (Or (Number)) (Or (Number))))
  (loop defun rotate matrix prev n (do 
    (defconstant 
      next-matrix (if n (solve-2 matrix 5) (solve-1 matrix 4))
      next (count-seats next-matrix))
    (unless (= prev next) 
      (rotate next-matrix next n)
      next)))

(Array (go *matrix* (rotate -1 0)) (go *matrix* (rotate -1 1)))