(function remainder n d (if (< n d) n (remainder (- n d) d)))
(function factorial n (if (= n 1) 1 (* n (factorial (- n 1)))))
(function greatest_common_divisor a b (if (= b 0) a (greatest_common_divisor b (remainder a b))))

(unless (= 2 1) (log "yes") (log "no"))
