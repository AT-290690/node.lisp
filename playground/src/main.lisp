(let hello "Hello World")
(log (concatenate hello "!!!"))

(function fibonacci n 
  (if (< n 2) 
      n
      (+ (fibonacci (- n 1))
         (fibonacci (- n 2)))))

(log (fibonacci 10))

(function move 
            n from to stare 
            (if (>= n 1)
            (block 
              (move (- n 1) from stare to)
              (log (concatenate "Move disk from tower " from " to tower " to))
              (move (- n 1) stare to from))))
(move 6 "A" "B" "C")
