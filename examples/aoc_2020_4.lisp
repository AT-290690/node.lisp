(import std  "remove" "for_each" "push" "map" "regex_match" "split_by_n_lines" "deep_flat" "split_by" "join" "every" "reduce" "sum_array")

(let sample "ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

hcl:#7d3b0c iyr:2013
eyr:2026
ecl:oth pid:920076943 byr:1929
hgt:76in")

(let input sample)
(let input (open "./playground/src/aoc_2020/4/input.txt"))

; 190
(function validate_fields fields (do fields (map (lambda x _ _ 
                        (do x (map (lambda y _ _ 
                          (do y (regex_match "byr|iyr|eyr|hgt|hcl|ecl|pid")))) 
                                (deep_flat))))
                  (remove (lambda x _ _ (= (length x) 7)))))
(do input (split_by_n_lines 2)
                (validate_fields)
                  (length)
                  (log))

; byr (Birth Year) - four digits; at least 1920 and at most 2002.
; iyr (Issue Year) - four digits; at least 2010 and at most 2020.
; eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
; hgt (Height) - a number followed by either cm or in:
; If cm, the number must be at least 150 and at most 193.
; If in, the number must be at least 59 and at most 76.
; hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
; ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
; pid (Passport ID) - a nine-digit number, including leading zeroes.
; cid (Country ID) - ignored, missing or not.
(function to_entries array (map array (lambda x _ _ (do x (map (lambda y _ _ (do y (split_by " ")))) (deep_flat) (map (lambda x _ _ (split_by x ":")))))))
(function without_invalid_fields fields (do fields 
                                            (map (lambda x _ _  (do x 
                                             (remove (lambda y _ _ (and (not (= (car y) "cid")) (regex_match (car y) "byr|iyr|eyr|hgt|hcl|ecl|pid")))))))))
(do input 
     (split_by_n_lines 2)
     (to_entries)
     (without_invalid_fields)
     (remove (lambda x _ _ (= (length x) 7)))
     (map (lambda x _ _ (do x     
      (map (lambda y _ _ (block
        (let key (car y))
        (let value (car (cdr y)))
        (let arr (... value))
       (Array key value
        (if (= key "byr")
          (and (= (length arr) 4) (>= (type value Number) 1920)
            (<= (type value Number) 2002)) 
          (if (= key "iyr")  
            (and (= (length arr) 4) (>= (type value Number) 2010)
              (<= (type value Number) 2020))
            (if (= key "eyr")
              (and (= (length arr) 4) (>= (type value Number) 2020)
                (<= (type value Number) 2030))
              (if (= key "hgt")
                (and (>= (length arr) 3) (block 
                  (let units (concatenate (get arr -2) (get arr -1)))
                  (let num (type (join (set arr -2) "") Number))
                    ; If cm, the number must be at least 150 and at most 193.
                    (if (= units "cm") (and (>= num 150) (<= num 193))
                      ; If in, the number must be at least 59 and at most 76.
                      (if (= units "in") (and (>= num 59) (<= num 76))))))
                (if (= key "hcl") (block 
                  (let color (regex_match value "#.+[0-9a-f]"))
                    (and (length color) (= (length (... (car color))) 7)))
                  (if (= key "ecl")
                    (and (= (length arr) 3) (length (regex_match value "amb|blu|brn|gry|grn|hzl|oth")))
                    (if (= key "pid") 
                      (and 
                        (= (length arr) 9) 
                        (length (regex_match value "[0-9]{9}")))))))))))))))))
       (remove (lambda x _ _ (every x (lambda y _ _ (= (get y -1) 1)))))
      ; (map (lambda x _ _ (log x)))
      (length)
      (log))