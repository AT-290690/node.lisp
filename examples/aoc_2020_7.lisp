(import std "split_by" "split" "map" "trim" "push" "every" "remove")
(let sample 
"light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.")

(let input sample)
; (let input (open "./playground/src/aoc_2020/7/input.txt"))

; (function left array (map array (lambda x _ _ (do x (regex_match "^(.*(?= bags contain))")))))
(function bags array 
          (map array (lambda x _ _ (do x (regex_match "^(.*(?= bags contain))|(?<=(contain )).*(?=(,|.))") 
  (map (lambda y _ _ (do y (split ", "))))))))
; (map (lambda z _ _ (regex_match z "[1-9]|.*")))
(log "-------------------------------------------------------------")
(loop solve bag sum (block 
  (+ sum (car (car (cdr bag))))
))


(do 
  input 
  (split_by "\n") 
  (bags)
  (remove (lambda bag _ _ (not 
                            (or 
                              (= (car (car bag)) "shiny gold")
                              (= (car (car (cdr bag))) "no other bags")))))
  (map (lambda bag _ _ (block 
    (let head (car (car bag)))
    (let body (car (car (cdr bag))))
    (let tail (cdr (car (cdr bag))))
    (let chunk-body (split body " "))
    (let chunk-tail (if (length tail) (split (car tail) " ") (Array 0 "" "" -1))) 
    (do chunk-body (set 0 (type (car chunk-body) Number)) (set -1))
    (do chunk-tail (set 0 (type (car chunk-tail) Number)) (set -1))
    (Array (split head " ") chunk-body chunk-tail))))
    (remove (lambda bag _ _ (block 
      (let a (cdr (car (cdr bag))))
      (let b (car (cdr (cdr bag))))
      (let la (car a))
      (let ra (car (cdr a)))
      (let lb (car b))
      (let rb (car (cdr b)))
      (or (and (= la "shiny") (= ra "gold")) 
          (and (= lb "shiny") (= rb "gold"))))))
    (log))

(log "-------------------------------------------------------------")
; (let probe (probe-file))
; (loop iterate array
;   (if (length (cdr array)) (block 
;     (if (> (car (cdr (car array))) 1000) 
;       (log (car array)))
;     (iterate (cdr array)))))
; (iterate (car probe))
