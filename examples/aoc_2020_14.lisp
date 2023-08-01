
(import std 
  "reduce" "push" "remove" "deep-flat" "for-each"
  "hash-index" "euclidean-mod" "array-in-bounds-p" "find-index"
  "hash-table-set" "hash-table-has" "hash-table-get" "hash-table" "hash-table-make"
  "split-by-lines" "join" "split-by" "every" "trim" "array-of-numbers" "map" "min"
  "some" "find" "slice" "power"  "concat" "sum-array" "count-number-of-ones-bit" "for-n")

(defconstant *input* 
(String 
"mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0"
"mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1"))

(defun Int n (type n Integer))
; for debug use only
(defun int-to-bit int (go int (type Number) (Bit)))
(defun sum-array-ints ints (reduce ints (lambda a b . . (+ a b)) (Int 0)))
(defun to-mask-of arr t (go arr (reduce (lambda acc x . . (if (= x t) (go acc (<< (Int 1)) (| (Int 1))) (go acc (<< (Int 1))))) (Int 0))))

(defun part1 input (do 
    (go input (split-by-lines)
      (map (lambda x . . (split-by x " = ")))
      (reduce (lambda a b . . (do
        (if (= (car b) "mask") (do
          (defconstant mask (go (car (cdr b)) (type Array)))
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

(defun spread-xmask xmask x (do
  (defvar rev-result (Int 0))
  (loop defun iter-and i (when (< i 36) 
    (do 
      (setf rev-result (<< rev-result (Int 1)))
      (when (= (& xmask (Int 1)) (Int 1)) (do 
        (setf rev-result (| rev-result (& x (Int 1))))
        (setf x (>> x (Int 1)))))
      (setf xmask (>> xmask (Int 1)))
      (iter-and (+ i 1)))))
  (iter-and 0)

  (defvar result (Int 0))
   (loop defun iter-or i (if (< i 36) 
    (do 
      (setf result (| (<< result (Int 1)) (& rev-result (Int 1))))
      (setf rev-result (>> rev-result (Int 1)))
      (iter-or (+ i 1)))))
  (iter-or 0)
  result))

 
(defun part2 input (do 
    (defvar n 0)
    (go input (split-by-lines)
      (map (lambda x . . (split-by x " = ")))
      (reduce (lambda a b . . (do
        (if (= (car b) "mask") (do
          (defconstant 
                mask (go (car (cdr b)) (type Array))
                xmask (to-mask-of mask "X")
                omask (to-mask-of mask "1"))
          (setf n (<< 2 (count-number-of-ones-bit (type xmask Number))))
          (push a (Array (Integer xmask omask))))
          (push (get a -1) 
                (Array (go b
                  (car)
                  (regex-match "[0-9]")
                  (join "")
                  (type Number))
                  (car (cdr b))))) a)) ())
      (reduce (lambda memory fields . .
        (reduce (cdr fields) (lambda memory x . . (do
        (defconstant 
              omask (go fields (car) (cdr) (car) (Int))
              xmask (go fields (car) (car) (Int))
              addr (& (| (Int (car x)) omask) (~ xmask))
              value (go x (cdr) (car) (Int)))
        (for-n n (lambda i (hash-table-set memory (type (| addr (spread-xmask xmask (Int i))) Number) value))) 
        memory)) memory))
        (hash-table 10))
    (deep-flat)
    (remove (lambda . i . (= (mod i 2) 1)))
    (sum-array-ints))))

(Array 
  (part1 (car *input*))
  (part2 (car (cdr *input*))))
