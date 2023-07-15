(import std "split-by" "map" "find" "remove" "push" "reduce")

(let sample "nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6")

(let *input* sample)
; (let *input* (open "./playground/src/aoc_2020/8/input.txt"))

(let *stack* (do *input* 
  (split-by "\n")
  (map (lambda x _ _ (block 
    (let cmd (do x (split-by " ")))
    (set cmd 1 (type (get cmd 1) Number)))))))

(loop *solve1* instructions offset accumulator (block 
   
   (let 
      instruction (get instructions offset)
      cmd (car instruction)
      value (car (cdr instruction)))

   (unless (= (length instruction) 3) 
     (*solve1* 
        (set instructions offset (Array cmd value (Array offset accumulator)))
        (+ offset (if (= cmd "jmp") value 1)) 
        (if (= cmd "acc") (+ accumulator value) accumulator))
       accumulator)))

(loop *solve2* instructions offset accumulator (unless (= offset (length instructions)) (block 
   
   (let 
      instruction (get instructions offset)
      cmd (car instruction)
      value (car (cdr instruction)))

   (unless (= (length instruction) 3) 
     (*solve2* 
       (set instructions offset (Array cmd value (Array offset accumulator)))
       (+ offset (if (= cmd "jmp") value 1)) 
       (if (= cmd "acc") (+ accumulator value) accumulator)) 
        (block
          (do 
            instructions
            (remove (lambda x i _ (and (= (length x) 3) (or (= (car x) "nop") (= (car x) "jmp")))))
            (map (lambda x _ _ (block 
              (let 
                cmd (if (= (car x) "jmp") "nop" "jmp")
                value (car (cdr x))
                options (get x -1))
              (Array cmd value options)))))))) accumulator))
(Array 
  (do 
    *stack*
    (*solve1* 0 0))

  (do 
    *stack*
    (*solve2* 0 0)
    (reduce 
      (lambda acc x _ _ 
        (block 
          (let 
            cmd (car x)
            value (car (cdr x))
            options (get x -1)
            offset (car options)
            accumulator (car (cdr options))
            result (*solve2* *stack* (+ offset (if (= cmd "jmp") value 1)) accumulator))
          (if (atom result) result acc))) 0)))