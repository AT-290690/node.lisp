; (let hello "Hello World")
; (log (concatenate hello "!!!"))

(let sample "1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc")
(function duplicates string letter (block
  (let array (... string))
  (let bitmask 0)
  (let zero (char "a" 0))
  (let count 0)
  (loop iterate i bounds (block
      (let ch (get array i))
      (let code (- ch zero))
      (let mask (<< 1 code))
      (if (and (eq ch letter) 
          (not (eq (& bitmask mask) 0))) 
          (= count (+ count 1))
          (= bitmask (| bitmask mask)))
      (if (< i bounds) (iterate (+ i 1) bounds) count)
    )) (iterate 0 (- (length array) 1))))
(log sample)
  (do 
    "abcdd" 
    (duplicates "d") 
    (log)
  )
(log (regex_match sample "(['d]-[0-9])"))
(log (regex_match sample "[a-z]:"))
(log (regex_match sample "(?<=:\s)(.*)"))