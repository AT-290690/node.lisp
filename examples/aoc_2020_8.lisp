(import std "split-by" "map" "find" "remove" "push" "reduce")

(defconstant sample "nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6")

(defconstant *input* sample)
; (defvar *input* (:open "./playground/src/aoc_2020/8/input.txt"))

(defconstant *stack* 
  (go 
    *input* 
    (split-by "\n")
    (map (lambda x . . (do 
      (defvar cmd (go x (split-by " ")))
      (set cmd 1 (type (get cmd 1) Number)))))))

(loop defun find-infinite-loop instructions offset accumulator (do 
   
   (defconstant 
      instruction (get instructions offset)
      cmd (car instruction)
      value (car (cdr instruction)))

   (unless (= (length instruction) 3) 
     (find-infinite-loop 
        (set instructions offset (Array cmd value (Array offset accumulator)))
        (+ offset (if (= cmd "jmp") value 1)) 
        (if (= cmd "acc") (+ accumulator value) accumulator))
       accumulator)))

(loop defun fix-infinite-loop instructions offset accumulator (unless (= offset (length instructions)) (do 
   
   (defvar 
      instruction (get instructions offset)
      cmd (car instruction)
      value (car (cdr instruction)))

   (unless (= (length instruction) 3) 
     (fix-infinite-loop 
       (set instructions offset (Array cmd value (Array offset accumulator)))
       (+ offset (if (= cmd "jmp") value 1)) 
       (if (= cmd "acc") (+ accumulator value) accumulator)) (do
        (go 
          instructions
          (remove (lambda x i . (and (= (length x) 3) (or (= (car x) "nop") (= (car x) "jmp")))))
          (map (lambda x . . (do 
            (defconstant 
              cmd (if (= (car x) "jmp") "nop" "jmp")
              value (car (cdr x))
              options (get x -1))
            (Array cmd value options)))))))) accumulator))
(Array 
  (go 
    *stack*
    (find-infinite-loop 0 0))

  (go 
    *stack*
    (fix-infinite-loop 0 0)
    (reduce 
      (lambda acc x . . (do 
          (defconstant 
            cmd (car x)
            value (car (cdr x))
            options (get x -1)
            offset (car options)
            accumulator (car (cdr options))
            result (fix-infinite-loop *stack* (+ offset (if (= cmd "jmp") value 1)) accumulator))
          (if (atom result) result acc))) 0)))