(import ds "hash-index"
  "hash-table-add!" "hash-table?" "hash-table-get" "hash-table" "hash-table-make" "hash-index" "hash-table-get" "hash-table"
  "hash-set-add!" "hash-set-remove!" "hash-set?" "hash-set-get" "hash-set" "hash-set-make")
(import std  "array-in-bounds?" "find-index" "map" "for-n" "iteration" "reduce" "array-in-bounds?" "find-index" "index-of"
            "count-of" "for-each"  "for-range" "concat" "every?"
             "deep-flat")
(import str "split-by-lines" "join" "split" "split-by" "trim"  "left-pad" "right-pad" )
(import math "summation" "floor" "euclidean-mod" "max" "min" "abs")

(defconstant input 
"..#....#
##.#..##
.###....
#....#.#
#.######
##.#....
#.......
.#......")

(defconstant sample
".#.
..#
###")

(deftype to-3d-key (Lambda (Or (Number)) (Or (Number)) (Or (Number)) (Or (String))))
(defun to-3d-key y x z (concatenate (type y String) " " (type x String) " " (type z String)))
(deftype to-4d-key (Lambda (Or (Number)) (Or (Number)) (Or (Number)) (Or (Number)) (Or (String))))
(defun to-4d-key y x z w (concatenate (type y String) " " (type x String) " " (type z String) " " (type w String)))
(deftype from-3d-key (Lambda (Or (String)) (Or (Array (Number) (Number) (Number)))))
(defun from-3d-key key (do (destructuring-bind y x z . (split key " ")) (Array (type y Number) (type x Number) (type z Number))))
(deftype from-4d-key (Lambda (Or (String)) (Or (Array (Number) (Number) (Number) (Number)))))
(defun from-4d-key key (do (destructuring-bind y x z w . (split key " ")) (Array (type y Number) (type x Number) (type z Number) (type w Number))))

(defun parse-input-3d input (do 
  (defconstant matrix (hash-set 20))
  (go 
  input
  (split-by-lines)
  (for-each (lambda row x .
    (go row 
      (type Array) 
      (for-each (lambda col y . (when (= col "#") (hash-set-add! matrix (to-3d-key y x 0)))))))))
      matrix))

(defun parse-input-4d input (do 
  (defconstant matrix (hash-set 140))
  (go 
  input
  (split-by-lines)
  (for-each (lambda row x .
    (go row 
      (type Array) 
      (for-each (lambda col y . (when (= col "#") (hash-set-add! matrix (to-4d-key y x 0 0)))))))))
      matrix))

(deftype neighborhood-3d (Lambda (Or (Array (Array (String)))) (Or (Array (Array (Number) (Number) (Number))))  (Or (Number)) (Or (Number)) (Or (Number)) (Or (Number))))
(defun neighborhood-3d matrix directions y x z (reduce directions (lambda acc dir . . (do
                  (defconstant
                      dy (+ (get dir 0) y)
                      dx (+ (get dir 1) x)
                      dz (+ (get dir 2) z)
                      dkey (to-3d-key dy dx dz)
                      is-active (hash-set? matrix dkey))
                      (+ acc is-active))) 0))

(deftype neighborhood-4d (Lambda (Or (Array (Array (String)))) (Or (Array (Array (Number) (Number) (Number) (Number)))) (Or (Number)) (Or (Number)) (Or (Number)) (Or (Number)) (Or (Number))))
(defun neighborhood-4d matrix directions y x z w (reduce directions (lambda acc dir . . (do
                  (defconstant
                      dy (+ (get dir 0) y)
                      dx (+ (get dir 1) x)
                      dz (+ (get dir 2) z)
                      dw (+ (get dir 3) w)
                      dkey (to-4d-key dy dx dz dw)
                      is-active (hash-set? matrix dkey))
                      (+ acc is-active))) 0))

(defconstant directions-2d (' 
                  (' 0 1) (' 1 0) (' -1 0) (' 0 -1) (' 1 -1) (' -1 -1) (' 1 1) (' -1 1)))

(defconstant directions-3d (' 
                  (' 0 0 -1) (' 0 0 1)
                  (' 0 1 0) (' 1 0 0) (' -1 0 0) (' 0 -1 0) (' 1 -1 0) (' -1 -1 0) (' 1 1 0) (' -1 1 0)
                  (' 0 1 1) (' 1 0 1) (' -1 0 1) (' 0 -1 1) (' 1 -1 1) (' -1 -1 1) (' 1 1 1) (' -1 1 1) 
                  (' 0 1 -1) (' 1 0 -1) (' -1 0 -1) (' 0 -1 -1) (' 1 -1 -1) (' -1 -1 -1) (' 1 1 -1) (' -1 1 -1)))

(defconstant directions-4d (' 
                  (' 0 0 -1 0) (' 0 0 1 0) (' 0 0 0 1) (' 0 0 0 -1) (' 0 0 1 1) (' 0 0 -1 -1) (' 0 0 -1 1)  (' 0 0 1 -1)  

                  (' 0 1 0 0) (' 1 0 0 0) (' -1 0 0 0) (' 0 -1 0 0) (' 1 -1 0 0) (' -1 -1 0 0) (' 1 1 0 0) (' -1 1 0 0)
                  (' 0 1 1 0) (' 1 0 1 0) (' -1 0 1 0) (' 0 -1 1 0) (' 1 -1 1 0) (' -1 -1 1 0) (' 1 1 1 0) (' -1 1 1 0) 
                  (' 0 1 -1 0) (' 1 0 -1 0) (' -1 0 -1 0) (' 0 -1 -1 0) (' 1 -1 -1 0) (' -1 -1 -1 0) (' 1 1 -1 0) (' -1 1 -1 0)
                  
                  (' 0 1 0 1) (' 1 0 0 1) (' -1 0 0 1) (' 0 -1 0 1) (' 1 -1 0 1) (' -1 -1 0 1) (' 1 1 0 1) (' -1 1 0 1)
                  (' 0 1 1 1) (' 1 0 1 1) (' -1 0 1 1) (' 0 -1 1 1) (' 1 -1 1 1) (' -1 -1 1 1) (' 1 1 1 1) (' -1 1 1 1) 
                  (' 0 1 -1 1) (' 1 0 -1 1) (' -1 0 -1 1) (' 0 -1 -1 1) (' 1 -1 -1 1) (' -1 -1 -1 1) (' 1 1 -1 1) (' -1 1 -1 1)
                  
                  (' 0 1 0 -1) (' 1 0 0 -1) (' -1 0 0 -1) (' 0 -1 0 -1) (' 1 -1 0 -1) (' -1 -1 0 -1) (' 1 1 0 -1) (' -1 1 0 -1)
                  (' 0 1 1 -1) (' 1 0 1 -1) (' -1 0 1 -1) (' 0 -1 1 -1) (' 1 -1 1 -1) (' -1 -1 1 -1) (' 1 1 1 -1) (' -1 1 1 -1) 
                  (' 0 1 -1 -1) (' 1 0 -1 -1) (' -1 0 -1 -1) (' 0 -1 -1 -1) (' 1 -1 -1 -1) (' -1 -1 -1 -1) (' 1 1 -1 -1) (' -1 1 -1 -1)))

(defun solve-1 matrix (do
  (defvar 
    max-w 1 max-h 1 max-d 1
    min-w 1 min-h 1 min-d 1
  )
  (go 
    matrix 
    (deep-flat) 
    (map (lambda key . . (do 
        (destructuring-bind y x z . (from-3d-key key))

        (when (> y max-h) (setf max-h y))
        (when (< y min-h) (setf min-h y))
        
        (when (> x max-w) (setf max-w x))
        (when (< x min-w) (setf min-w x))

        (when (> z max-d) (setf max-d z))
        (when (< z min-d) (setf min-d z))))))
        
      (defconstant next-matrix (hash-set 20))
      (for-range (+ min-h -1) (+ max-h 1) (lambda y 
        (for-range (+ min-w -1) (+ max-w 1) (lambda x 
          (for-range (+ min-d -1) (+ max-d 1) (lambda z (do 
      (defconstant 
          key (to-3d-key y x z)
          current (hash-set? matrix key)
          sum (neighborhood-3d matrix directions-3d y x z))
        ; If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. 
        ; Otherwise, the cube becomes inactive.
        ; If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. 
        ; Otherwise, the cube remains inactive.
        (if (or (and (= current 1) (or (= sum 2) (= sum 3))) (and (= current 0) (= sum 3))) (hash-set-add! next-matrix key)))))))))
        next-matrix))

(defun solve-2 matrix (do
  (defvar 
    max-w 1 max-h 1 max-d 1 max-t 1
    min-w 1 min-h 1 min-d 1 min-t 1
  )
  (go 
    matrix 
    (deep-flat) 
    (map (lambda key . . (do 
        (destructuring-bind y x z w . (from-4d-key key))

        (when (> y max-h) (setf max-h y))
        (when (< y min-h) (setf min-h y))
        
        (when (> x max-w) (setf max-w x))
        (when (< x min-w) (setf min-w x))

        (when (> z max-d) (setf max-d z))
        (when (< z min-d) (setf min-d z))
        
        (when (> w max-t) (setf max-t w))
        (when (< w min-t) (setf min-t w))))))
        
      (defconstant next-matrix (hash-set 140))
      (for-range (+ min-h -1) (+ max-h 1) (lambda y 
        (for-range (+ min-w -1) (+ max-w 1) (lambda x 
          (for-range (+ min-d -1) (+ max-d 1) (lambda z 
            (for-range (+ min-t -1) (+ max-t 1) (lambda w (do 
      (defconstant 
          key (to-4d-key y x z w)
          current (hash-set? matrix key)
          sum (neighborhood-4d matrix directions-4d y x z w))
        ; If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. 
        ; Otherwise, the cube becomes inactive.
        ; If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. 
        ; Otherwise, the cube remains inactive.
        (if (or (and (= current 1) (or (= sum 2) (= sum 3))) (and (= current 0) (= sum 3))) (hash-set-add! next-matrix key)))))))))))
        next-matrix))


; 3x3x1
(defun format-matrix-2d matrix index (go matrix
                                  (map (lambda row . .
                                    (go row
                                      (map (lambda col . .
                                        (go col (get index) (if "#" "."))))
                                        (join ""))))
                                  (join "\n")))

(deftype to-3d-matrix (Lambda (Or (Array (Array (String)))) (Or (Number)) (Or (Array (Array (Array (Number)))))))
(defun to-3d-matrix matrix size (go matrix (deep-flat) (reduce (lambda a coords . . (do 
    (destructuring-bind y x z . (from-3d-key coords))
    (set (get (get a y) x) z 1) a))
      (map (Array size length) (lambda . . .
        (map (Array size length) (lambda . . .
          (map (Array size length) (lambda . . . 0)))))))))
(deftype to-4d-matrix (Lambda (Or (Array (Array (String)))) (Or (Number)) (Or (Array (Array (Array (Number)))))))
(defun to-4d-matrix matrix size (go matrix (deep-flat) (reduce (lambda a coords . . (do 
    (destructuring-bind y x z w . (from-4d-key coords))
    (set (get (get (get a y) x) z) w 1) a))
      (map (Array size length) (lambda . . .
        (map (Array size length) (lambda . . .
          (map (Array size length) (lambda . . .
            (map (Array size length) (lambda . . . 0)))))))))))

(deftype count-c (Lambda (Or (Array (Array (String)))) (Or (Number))))                                 
(defun count-c c (reduce c (lambda a x . . (+ a (length x))) 0))
(Array 
  (go (go sample (parse-input-3d)) (solve-1) (count-c))
  ; (go (go input (parse-input-3d)) (solve-1) (count-c))
  ; (go (go sample (parse-input-4d)) (solve-2) (count-c))
  ; (go (go input (parse-input-4d)) (solve-2) (count-c))
  )
