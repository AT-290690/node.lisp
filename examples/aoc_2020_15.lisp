(import std "push" "last-index-of-ending-from")

(loop defun rambunctious-recitation T stack (do 
(defconstant last (get stack -1))
  (if (= (length stack) T) 
    last
    (do 
      (unless (= (last-index-of-ending-from stack last -1) -1) 
        (push stack 
          (- (+ (last-index-of-ending-from stack last 0) 1) (+ (last-index-of-ending-from stack last -1) 1)))
        (push stack 0)) 
    (rambunctious-recitation T stack)))))
  (Number 
    (rambunctious-recitation 10 (Number 0 3 6))
    ; (rambunctious-recitation 2020 (Number 1 3 2))
    ; (rambunctious-recitation 2020 (Number 2 1 3))
    ; (rambunctious-recitation 2020 (Number 1 2 3))
    ; (rambunctious-recitation 2020 (Number 2 3 1))
    ; (rambunctious-recitation 2020 (Number 3 2 1))
    ; (rambunctious-recitation 2020 (Number 0 5 4 1 10 14 7))
)