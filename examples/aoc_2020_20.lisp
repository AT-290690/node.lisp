(import std "every?" "number-of" "accumulate" "scan" "fold" "find-index" "for-n" "for-each" "slice" "array-in-bounds?" "map" "all?" "any?" "reverse" "reduce" 
"take" "take" "for-range" "deep-flat" "for-of" "zip" "reverse" "concat" "index-of" "select" "except" "rotate-square-matrix" "flip-square-matrix")
(import math "floor" "sqrt" "euclidean-mod" "summation" "product" "round" "abs" "square" "average")
(import ds "hash-set-make" "hash-set" "hash-set-add!" "hash-set-remove!" "hash-set?" "hash-index")
(import str "split-by-lines" "split-by-n-lines" "split" "join")

(defconstant sample 
"Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...")
(defconstant *input* sample)
; (defvar *input* (:open "./playground/src/aoc_2020/20/input.txt"))
(defvar *part-1* 0)
(deftype parse-input (Lambda (Or (String)) (Or (Array (Array (Number) (Array (Array (String))))))))
(defun parse-input input (go 
  input
  (split-by-n-lines 2)
  (scan (lambda tile (Array 
    (type (car (regex-match (car tile) "[0-9]+")) Number)
    (go (cdr tile) (scan (safety lambda t (go t (type Array))))))))))

(defconstant foldcat (function args (fold args (lambda a b (concat a b)) ())))
(defconstant *tiles* 
  (foldcat 
    (defconstant *parsed* (go *input* (parse-input)))
    (go *parsed* (scan (lambda tile (Array (car tile) (rotate-square-matrix (car (cdr tile)))))))
    (go *parsed* (scan (lambda tile (Array (car tile) (rotate-square-matrix (rotate-square-matrix (car (cdr tile))))))))
    (go *parsed* (scan (lambda tile (Array (car tile) (rotate-square-matrix (rotate-square-matrix (rotate-square-matrix (car (cdr tile)))))))))
    (go *parsed* (scan (lambda tile (Array (car tile) (flip-square-matrix (car (cdr tile)))))))
    (go *parsed* (scan (lambda tile (Array (car tile) (flip-square-matrix (rotate-square-matrix (car (cdr tile))))))))
    (go *parsed* (scan (lambda tile (Array (car tile) (flip-square-matrix (rotate-square-matrix (rotate-square-matrix (car (cdr tile)))))))))
    (go *parsed* (scan (lambda tile (Array (car tile) (flip-square-matrix (rotate-square-matrix (rotate-square-matrix (rotate-square-matrix (car (cdr tile))))))))))))
                  
(deftype diff? (Lambda (Or (Array (String))) (Or (Array (String))) (Or (Boolean))))
(defun diff? a b (= (join a "") (join b "")))

(deftype left (Lambda (Or (Array (Array (String)))) (Or (Array (String)))))
(defun left matrix (scan matrix (safety lambda x (get x 0))))
(deftype right (Lambda (Or (Array (Array (String)))) (Or (Array (String)))))
(defun right matrix (scan matrix (safety lambda x (get x -1))))
(deftype top (Lambda (Or (Array (Array (String)))) (Or (Array (String)))))
(defun top matrix (get matrix 0))
(deftype bottom (Lambda (Or (Array (Array (String)))) (Or (Array (String)))))
(defun bottom matrix (get matrix -1))

(defconstant *size* (round (sqrt (length *parsed*))))
(defconstant *tile-size* 10)
(defconstant *grid* (scan (Array *size* length) (lambda . (Array *size* length))))
(defun backtrack row col visited (do 
  (unless (= row *size*)
    (for-of *tiles*
      (lambda tile 
        (when (not (hash-set? visited (car tile))) 
          (unless
            (or
              (and (> row 0)
                    (not (diff? 
                      (right (car (cdr (get (get *grid* (- row 1)) col))))
                      (left (car (cdr tile))))))
              (and (> col 0)
                    (not (diff?
                      (top (car (cdr (get (get *grid* row) (- col 1)))))
                      (bottom (car (cdr tile)))))))
            (unless *part-1* (do
              (set (get *grid* row) col tile)
              (hash-set-add! visited (car tile))
              (if (= col (- *size* 1))
                  (backtrack (+ row 1) 0 visited)
                  (backtrack row (+ col 1) visited))
              (hash-set-remove! visited (car tile))))))))
    (setf *part-1* (go 
      (Array 
        (car (get (get *grid* 0) 0)) 
        (car (get (get *grid* (- *size* 1)) 0))
        (car (get (get *grid* 0) (- *size* 1)))
        (car (get (get *grid* (- *size* 1)) (- *size* 1))))
    (product))))))
(backtrack 0 0 (hash-set 50))
(deftype slice-top-bottom (Lambda (Or (Array (Array (String)))) (Or (Array (Array (String))))))
(defun slice-top-bottom tile (except tile (lambda . col . (or (= col 0) (= col (- *tile-size* 1))))))
(deftype slice-left-right (Lambda (Or (Array (Array (String)))) (Or (Array (Array (String))))))
(defun slice-left-right tile (scan tile (lambda col (except col (lambda . row . (or (= row 0) (= row (- *tile-size* 1))))))))
(deftype roughness (Lambda (Or (Array (Array (String)))) (Or (Number))))
(defun roughness matrix (go matrix (scan (lambda x (number-of x (safety lambda y (= y "#"))))) (summation)))
(defconstant *monster* 
    (Array 
      (type "                  # " Array)
      (type "#    ##    ##    ###" Array)
      (type " #  #  #  #  #  #   " Array)))
(defconstant *sea-monster* 
  (go 
    *monster*
    (reduce (lambda a x i . 
      (concat a (go x (map (lambda y j . (when (= y "#") (' i j)))) 
                      (take (safety lambda x (Array? x)))))) ())))
(defconstant *image* 
    (go *grid* 
        (fold (lambda image tiles (do
          (for-each tiles (lambda tile-with-id index . (do 
          (defconstant 
              tile (car (cdr tile-with-id))
              current (go tile (slice-left-right) (slice-top-bottom))
              reversed (reverse current))
          (if (not index) 
            (set image (length image) (Array reversed)) 
            (set (get image -1) (length (get image -1)) reversed)
          ))))
          image)) ())))
    (defconstant *full-image* ())
    (defconstant *trim-tile-size* (- *tile-size* 2))
    (defconstant *full-size* (* *trim-tile-size* *size*))
    (defvar index 0)
    (for-n (- *size* 1) (lambda tiles
        (for-n (- *trim-tile-size* 1) (lambda row
            (do
          (defvar current ())
          (for-n (- *size* 1) (lambda tile (do 
              (setf current (concat current (go *image* (get tile) (get tiles) (get row)))))))
          (set *full-image* (length *full-image*) current))))))

(defconstant *picture* (go *full-image* (flip-square-matrix) (rotate-square-matrix)))
(defconstant 
  bounds-start-i 0
  bounds-end-i (length *picture*)
  bounds-start-j 0
  bounds-end-j (length (get *picture* 0))
)
(for-range bounds-start-i bounds-end-i (lambda i 
  (for-range bounds-start-j bounds-end-j (lambda j
     (do
        (defvar count 0)
        (go *sea-monster*
          (for-of (lambda pixel (do
            (defconstant 
              x (+ (car pixel) i)
              y (+ (car (cdr pixel)) j)) 
            (when (and (array-in-bounds? *picture* x) (array-in-bounds? (get *picture* x) y)) 
              (do
                ; its a sea monster if 15 pixels match
                (when (= (get (get *picture* x) y) "#") (setf count (+ count 1)))
                (when (= count (length *sea-monster*)) (do 
                (for-of *sea-monster* (lambda pixel (do 
                        (defconstant 
                                x (+ (car pixel) i)
                                y (+ (car (cdr pixel)) j)) 
                        (set (get *picture* x) y "o")))))))))))))))))
(defconstant *part-2* (roughness *picture*))
(Array *part-1* *part-2*)