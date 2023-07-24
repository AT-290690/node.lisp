(import std 
  "reduce" "push" "remove" "deep-flat" "for-each"
  "hash-index" "euclidean-mod" "array-in-bounds-p" "find-index"
  "hash-table-set" "hash-table-has" "hash-table-get" "hash-table" "hash-table-make"
  "split-by-lines" "join" "split-by" "every" "trim" "array-of-numbers" "map" "min"
  "some" "find" "slice" "power"  "concat" "sum-array" "hash-set-set" "hash-set-has" 
  "hash-set-get" "hash-set" "hash-set-make")


(defun Int n (type n Integer))
; for debug use only
(defun int-to-bit int (go int (type Number) (Bit)))
(defun sum-array-ints ints (reduce ints (lambda a b . . (+ a b)) (Int 0)))

(defun part1 input (do 
  (defun to-mask-of arr t (go arr (reduce (lambda acc x . . (if (= x t) (go acc (<< (Int 1)) (| (Int 1))) (go acc (<< (Int 1))))) (Int 0))))
    (go input (split-by-lines)
      (map (lambda x . . (split-by x " = ")))
      (reduce (lambda a b . . (do
        (if (= (car b) "mask") (do
          (defvar mask (go (car (cdr b)) (type Array)))
          (push a (Array (Integer (to-mask-of mask "X") (to-mask-of mask "1")))))
          (push (get a -1) 
                (Array (go b
                  (car)
                  (regex-match "[0-9]")
                  (join "")
                  (type Number))
                  (car (cdr b))))) a)) ())
      (reduce (lambda memory fields . .
        (reduce (cdr fields) (lambda memory x . .
            (hash-table-set memory
              (car x)
              (go
                x
                (cdr)
                (car)
                (Int)
                (& (go fields (car) (car) (Int)))
                (| (go fields (car) (cdr) (car) (Int))))))
              memory))
        (hash-table 10))
    (deep-flat)
    (remove (lambda . i . (= (mod i 2) 1)))
    (sum-array-ints))))

(defun part2 input (do 
(defun to-mask m floating (Array (go m (type Array) (reduce (lambda a x i o
                                      (cond 
                                          (= x "1") (go a (<< (Int 1)) (| (Int 1)))
                                          (= x "0") (go a (<< (Int 1)))
                                          (= x "X") (do (push floating (Int (- (length o) i 1))) (go a (<< (Int 1))))))
                                        (Int 0))) floating))
; (defvar variants (go floating (map (lambda x . . (go (Int 1) (<< x))))))


    (go input (split-by-lines)
      (map (lambda x . . (split-by x " = ")))
      (reduce (lambda a b . . (do
        (if (= (car b) "mask") (do
          (push a (go (car (cdr b)) (to-mask ()))))
          (push (get a -1) 
                (Array (go b
                  (car)
                  (regex-match "[0-9]")
                  (join "")
                  (type Number))
                  (car (cdr b))))) a)) ())
    (reduce (lambda memory fields . .
            (reduce (cdr (cdr fields)) (lambda memory x . .
                (do 
                (defvar 
                  variants (go (car (cdr fields)) (map (lambda x . . (go (Int 1) (<< x)))))
                  MASK (car fields))
                (go (concat 
                        (map variants (lambda x . . (go MASK (^ x))))
                        (map variants (lambda x . . (go MASK (^ x (Int 1)))))) 
                        (reduce (lambda a x . . (hash-set-set a (int-to-bit x))) memory))
                )) memory))
            (hash-set 10))
            ; (deep-flat)
            ; (sum-array-ints)
    )))






(Array 
(part1 "mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
  mem[8] = 11
  mem[7] = 101
  mem[8] = 0")
; (part2 
; "mask = 000000000000000000000000000000X1001X
; mem[42] = 100
; mask = 00000000000000000000000000000000X0XX
; mem[26] = 1")
)