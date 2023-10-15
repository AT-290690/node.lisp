(import std "scan" "fold" "find-index" "for-n" "array-in-bounds?" "map" "all?" "any?" "reverse" "reduce"
"take" "deep-flat" "for-of" "zip" "reverse" "concat" "index-of" "rotate-square-matrix" "flip-square-matrix")
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
; (deftype matrix-t (Array (Array (Number))))
; (deftype input-t (String))
(defconstant *INPUT* sample)
; (defvar *INPUT* (:open "./playground/src/aoc_2020/20/input.txt"))
(defvar *PART-1* 0)
(deftype parse-input (Lambda (Or (String)) (Or (Array (Array (Number) (Array (Array (String))))))))
(defun parse-input input (go 
  input
  (split-by-n-lines 2)
  (scan (lambda tile (Array 
    (type (car (regex-match (car tile) "[0-9]+")) Number)
    (go (cdr tile) (scan (lambda t (go t (type Array) 
    ; (scan (lambda x (= x "#")))
    )))))))))

(defconstant foldcat (function args (fold args (lambda a b (concat a b)) ())))
(defconstant *TILES* 
  (foldcat 
    (defconstant *PARSED* (go *INPUT* (parse-input)))
    (go *PARSED* (scan (lambda tile (Array (car tile) (rotate-square-matrix (car (cdr tile)))))))
    (go *PARSED* (scan (lambda tile (Array (car tile) (rotate-square-matrix (rotate-square-matrix (car (cdr tile))))))))
    (go *PARSED* (scan (lambda tile (Array (car tile) (rotate-square-matrix (rotate-square-matrix (rotate-square-matrix (car (cdr tile)))))))))
    (go *PARSED* (scan (lambda tile (Array (car tile) (flip-square-matrix (car (cdr tile)))))))
    (go *PARSED* (scan (lambda tile (Array (car tile) (flip-square-matrix (rotate-square-matrix (car (cdr tile))))))))
    (go *PARSED* (scan (lambda tile (Array (car tile) (flip-square-matrix (rotate-square-matrix (rotate-square-matrix (car (cdr tile)))))))))
    (go *PARSED* (scan (lambda tile (Array (car tile) (flip-square-matrix (rotate-square-matrix (rotate-square-matrix (rotate-square-matrix (car (cdr tile))))))))))))
                  
; (defun diff? x (= (car x) (car (cdr x))))
; (defun not-match? x (not (= (car x) (car (cdr x)))))
; (defun match? x (= (car x) (car (cdr x))))
; (defun diff? a b (all? (zip a b) match?))

(defun diff? a b (= (join a "") (join b "")))

(defun left matrix (scan matrix (lambda x (get x 0))))
(defun right matrix (scan matrix (lambda x (get x -1))))
(defun top matrix (get matrix 0))
(defun bottom matrix (get matrix -1))

(defconstant *SIZE* (round (sqrt (length *PARSED*))))
(defconstant *TILE-SIZE* 10)
(defconstant *GRID* (scan (Array *SIZE* length) (lambda . (Array *SIZE* length))))

(defun backtrack row col visited (unless *PART-1* (do 
  (unless (= row *SIZE*)
    (for-of *TILES* 
      (lambda tile 
        (when (not (hash-set? visited (car tile))) 
          (unless
            (or
              (and (> row 0)
                    (not (diff? 
                      (right (car (cdr (get (get *GRID* (- row 1)) col))))
                      (left (car (cdr tile))))))
              (and (> col 0)
                    (not (diff?
                      (bottom (car (cdr (get (get *GRID* row) (- col 1)))))
                      (top (car (cdr tile)))))))
            (do
              (set (get *GRID* row) col tile)
              (hash-set-add! visited (car tile))
              (if (= col (- *SIZE* 1))
                  (backtrack (+ row 1) 0 visited)
                  (backtrack row (+ col 1) visited))
              (hash-set-remove! visited (car tile)))))))
    ; FINISHED
    (setf *PART-1* (go 
    (Array 
      (car (get (get *GRID* 0) 0)) 
      (car (get (get *GRID* (- *SIZE* 1)) 0))
      (car (get (get *GRID* 0) (- *SIZE* 1)))
      (car (get (get *GRID* (- *SIZE* 1)) (- *SIZE* 1))))
    (product)))))))
(backtrack 0 0 (hash-set 50))
(Array *PART-1*)
