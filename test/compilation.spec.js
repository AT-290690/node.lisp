import { deepStrictEqual } from 'assert'
import { runFromCompiled, runFromInterpreted } from '../src/utils.js'
describe('Compilation', () => {
  it('Should match interpretation', () =>
    [
      `(defvar x 8)
(or (cond 
(= x 10) "Ten"
(= x 9) "Nine"
(= x 8) "Eight") "NaN")`,
      `(defvar T (lambda x (lambda y (lambda (* 5 x y)))))
  (apply (apply (apply T 10) 3))`,
      ` (defvar bol (Boolean))
    (Array bol (boole bol 1) (boole bol 0) (boole bol 1) (boole bol 0))`,
      `(defun some array callback (block
      (defvar bol 1)
      (loop defun iterate i bounds (block
        (defvar res (callback (get array i) i array))
        (boole bol (type res Boolean))
        (if (and (not res) (< i bounds)) (iterate (+ i 1) bounds) bol)))
      (iterate 0 (- (length array) 1))))
        (defun equal a b 
     (or (and (atom a) (atom b) (= a b)) 
     (and (Arrayp a) 
          (= (length a) (length b)) 
            (not (some a (lambda . i . (not (equal (get a i) (get b i)))))))))
    (defvar patten (Array "hello" 10))
    (defvar patten2 (Array "hello" 11))
  (Array (equal patten (Array "hello" 10)) (equal patten (Array "hello" patten2)) 
  (Array 
    (equal 1 1) 
    (equal 1 2)
    (equal (Array 1 2) (Array 1 2))
    (equal (Array 1 2) (Array 1 2 3))
    (equal (Array 1 2) (Array 1 2 (Array 1 2)))
    (equal (Array 1 (Array 1 2)) (Array 1 2 (Array 1 2)))
    (equal (Array 1 2 (Array 1 2)) (Array 1 2 (Array 1 2)))))`,
      `(cdr (Array 1 2 3 4))`,
      `(car (Array 1 2 3 4))`,
      `(defvar x -1) (trace x (-))`,
      `(defvar x -1) (- x)`,
      `(- 1)`,
      `(Array 10 length)`,
      `(Array 10)`,
      `(if (< 1 2) 42 69)`,
      `(unless (< 1 2) 42 69)`,
      `(defvar array (Array 5 length))
    (set array -1)
    (length array)`,
      `(defvar array (Array 5 length))
    (set array -4)
    (length array)`,
      `(defvar array (Array 5 length))
    (set array -5)
    (length array)`,
      `(defun push array value (set array (length array) value))
    (defun concat array1 array2 (block
    (loop defun iterate i bounds (block
    (if (< i (length array2)) (push array1 (get array2 i)))
    (if (< i bounds) 
      (iterate (+ i 1) bounds)
    array1
    )))
    (iterate 0 (- (length array2) 1))))
    (defun sort arr (block
      (if (<= (length arr) 1) arr
      (block
        (defvar pivot (get arr 0))
        (defvar left-arr ())
        (defvar right-arr ())
    (loop defun iterate i bounds (block
        (defvar current (get arr i))
        (if (< current pivot) 
            (push left-arr current)
            (push right-arr current))
        (if (< i bounds) (iterate (+ i 1) bounds))))
        (iterate 1 (- (length arr) 1))
    (trace 
      left-arr (sort) 
      (push pivot) 
      (concat (sort right-arr)))
    ))))
    
    (defun reverse array (block
    (defvar len (length array))
    (defvar reversed (Array len length))
    (defvar offset (- len 1))
    (loop defun iterate i bounds (block
      (set reversed (- offset i) (get array i))
      (if (< i bounds) (iterate (+ i 1) bounds) reversed)))
    (iterate 0 offset)))
    (trace 
      (Array 1 0 8 -2 3)
      (sort)
      (reverse))`,

      `(defvar find (lambda array callback (block
    (loop defun interate i bounds (block
      (defvar current (get array i))
      (if (and (not (callback current i)) (< i bounds))
        (interate (+ i 1) bounds) 
        current)))
        (interate 0 (- (length array) 1)))))
  (find (Array 1 2 3 4 5 6) (lambda x i (= i 2)))`,
      `(defvar push (lambda array value (set array (length array) value)))
  (defvar for-each (lambda array callback (block 
    (loop defun interate i bounds (block
      (callback (get array i) i)
      (if (< i bounds) (interate (+ i 1) bounds) array)))
    (interate 0 (- (length array) 1)))))
    (defvar deep-flat (lambda arr (block 
      (defvar new-array ()) 
      (defvar flatten (lambda item (if (Arrayp item) (for-each item (lambda x . (flatten x))) 
      (push new-array item))))
      new-array
    )))
  (defvar arr (
  Array 
  (Array 1 2) 
  (Array 1 2) 
  (Array 1 3) 
  (Array 1 (Array 4 4 (Array "x" "y"))) 
  (Array 1 2))
)
(deep-flat arr)`,
      `(loop defun interate i (if (< i 100) 
  (interate (+ i 1)) i))
(interate 0)
`,
      `(defvar push (lambda array value (set array (length array) value)))
    (defvar concat (lambda array1 array2 (block
      (defvar interate (lambda i bounds (block
      (push array1 (get array2 i))
      (if (< i bounds) 
        (interate (+ i 1) bounds)
      array1
      ))))
    (interate 0 (- (length array2) 1)))))
    (trace 
      (Array 1 2 3)
      (push -1)
      (concat (type "abc" Array))
      (concat (Array 1 2 3 4))
      (concat (Array 5 6 7))
    )`,

      `(trace 1 
      (+ 2) 
        (* 3 4)
         (- 3 2))`,
      `(defvar sample 
      "1721
      979
      366
      299
      675
      1456")
      
      (defvar push (lambda array value (set array (length array) value)))
      
      (defvar max (lambda a b (if (> a b) a b)))
      (defvar min (lambda a b (if (< a b) a b)))
      
      (defvar map (lambda array callback (block 
      (defvar new-array ())
      (defvar i 0)
      (defvar interate (lambda i bounds (block
        (set new-array i (callback (get array i) i))
        (if (< i bounds) (interate (+ i 1) bounds) new-array)
      )))
      (interate 0 (- (length array) 1)))))
      
      (defvar reduce (lambda array callback initial (block
        (defvar interate (lambda i bounds (block
          (setf initial (callback initial (get array i) i))
          (if (< i bounds) (interate (+ i 1) bounds) initial))))
      (interate 0 (- (length array) 1)))))
      (defvar join (lambda array delim (reduce array (lambda a x i (concatenate a delim x)) "")))
      (defvar string_to_array (lambda string delim 
      (reduce (type string Array) (lambda a x i (block
          (if (= x delim) 
            (push a ()) 
            (block (push (get a -1) x) a)
          )))(push () ()))))
      
       (defvar split-by-lines (lambda string (map (string_to_array string "\n") (lambda x i (join x "")))))
       
       (map (map 
        (split-by-lines sample) 
          (lambda x i (type x Number))) 
          (lambda x i (- 2020 x)))
    `,
      `(defvar range (lambda start end (block
      (defvar array ())
      (defvar interate (lambda i bounds (block
        (set array i (+ i start))
        (if (< i bounds) (interate (+ i 1) bounds) array)
      )))
      (interate 0 (- end start)))))
      
      
      (defvar map (lambda array callback (block 
      (defvar new-array ())
      (defvar i 0)
      (defvar interate (lambda i bounds (block
        (set new-array i (callback (get array i) i))
        (if (< i bounds) (interate (+ i 1) bounds) new-array)
      )))
      (interate 0 (- (length array) 1)))))
      
      
      (defvar remove (lambda array callback (block
      (defvar new-array ())
      (defvar interate (lambda i bounds (block
        (defvar current (get array i))
        (if (callback current i) 
          (set new-array (length new-array) current))
        (if (< i bounds) (interate (+ i 1) bounds) new-array)
      )))
      (interate 0 (- (length array) 1)))))
      
      (defvar reduce (lambda array callback initial (block
        (defvar interate (lambda i bounds (block
          (setf initial (callback initial (get array i) i))
          (if (< i bounds) (interate (+ i 1) bounds) initial)
        )))
      (interate 0 (- (length array) 1)))))
      

(defvar is-odd (lambda x i (= (mod x 2) 1)))
(defvar mult_2 (lambda x i (* x 2)))
(defvar sum (lambda a x i (+ a x)))

(trace 
(Array 1 2 3 4 5 6 7 101) 
(remove is-odd)
(map mult_2)
(reduce sum 0))
      `,

      `(defvar range (lambda start end (block
        (defvar array ())
        (loop defun interate i bounds (block
          (set array i (+ i start))
          (if (< i bounds) (interate (+ i 1) bounds) array)))
        (interate 0 (- end start)))))
        
        
        (defvar map (lambda array callback (block 
        (defvar new-array ())
        (defvar i 0)
        (loop defun interate i bounds (block
          (set new-array i (callback (get array i) i))
          (if (< i bounds) (interate (+ i 1) bounds) new-array)))
        (interate 0 (- (length array) 1)))))
        
        
        (defvar remove (lambda array callback (block 
        (defvar new-array ())
        (loop defun interate i bounds (block
          (defvar current (get array i))
          (if (callback current i) 
            (set new-array (length new-array) current))
          (if (< i bounds) (interate (+ i 1) bounds) new-array)))
        (interate 0 (- (length array) 1)))))
        
        (defvar reduce (lambda array callback initial (block
          (loop defun interate i bounds (block
            (setf initial (callback initial (get array i) i))
            (if (< i bounds) (interate (+ i 1) bounds) initial)))
        (interate 0 (- (length array) 1)))))
        
  
  (defvar is-odd (lambda x i (= (mod x 2) 1)))
  (defvar mult_2 (lambda x i (* x 2)))
  (defvar sum (lambda a x i (+ a x)))
  
  (trace 
    (Array 1 2 3 4 5 6 7 101) 
    (remove is-odd)
    (map mult_2)
    (reduce sum 0)
  )
  `,
    ].forEach((source) =>
      deepStrictEqual(runFromInterpreted(source), runFromCompiled(source))
    ))
})
