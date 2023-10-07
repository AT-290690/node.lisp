(import std "push" "last-index-of-ending-from" "reduce")
(deftype rambunctious-recitation-1 (Lambda (Or (Number)) (Or (Array (Number))) (Or (Number))))
(loop defun rambunctious-recitation-1 target stack (do 
  (defconstant last (get stack -1))
    (if (= (length stack) target) 
      last
      (do 
        (unless (= (last-index-of-ending-from stack last -1) -1) 
          (push stack 
            (- (+ (last-index-of-ending-from stack last 0) 1) (+ (last-index-of-ending-from stack last -1) 1)))
          (push stack 0)) 
      (rambunctious-recitation-1 target stack)))))

(deftype rambunctious-recitation-2 (Lambda (Or (Number)) (Or (Array (Number))) (Or (Number))))
(defun rambunctious-recitation-2 target stack (do 
  (defvar last (get stack -1))
  (defconstant memo (reduce stack (safety lambda acc item i . (set acc item (Array (+ i 1)))) (Array (+ target (length stack)) length)))
  (loop defun iterate i (if (<= i target) (do 
    (setf last 
    (if (and (get memo last) (= (length (defconstant current (get memo last))) 2))
        (- (car (cdr current)) (car current)) 
        0))
    (defconstant entry (or (get memo last) (Array))
                 size (length entry))
    (set memo last
      (cond 
        (= size 2) (Array (car (cdr entry)) i)
        (= size 1) (Array (car entry) i)
        (= size 0) (Array i)))
        (iterate (+ i 1))) last))
    (iterate (+ (length stack) 1))))

  (Array 
    (rambunctious-recitation-1 10 (Array 0 3 6))
    (rambunctious-recitation-2 10 (Array 0 3 6))
    ; (rambunctious-recitation 2020 (Array 1 3 2))
    ; (rambunctious-recitation 2020 (Array 2 1 3))
    ; (rambunctious-recitation 2020 (Array 1 2 3))
    ; (rambunctious-recitation 2020 (Array 2 3 1))
    ; (rambunctious-recitation 2020 (Array 3 2 1))
    ; (rambunctious-recitation 2020 (Array 0 5 4 1 10 14 7))
)