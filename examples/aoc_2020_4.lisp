(import std  "filter" "for_each" "push" "map" "regex_match" "split_by_n_lines" "deep_flat" "split_by" "join" "every" "reduce" "sum_array")
; (let sample "ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
; byr:1937 iyr:2017 cid:147 hgt:183cm

; iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
; hcl:#cfa07d byr:1929

; hcl:#ae17e1 iyr:2013
; eyr:2024
; ecl:brn pid:760753108 byr:1931
; hgt:179cm

; hcl:#cfa07d eyr:2025 pid:166559648
; iyr:2011 ecl:brn hgt:59in")
(let sample "ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

hcl:#7d3b0c iyr:2013
eyr:2026
ecl:oth pid:920076943 byr:1929
hgt:76in")
; (let sample "byr:2002
; byr:2003

; hgt:60in
; hgt:190cm
; hgt:190in
; hgt:190

; hcl:#123abc
; hcl:#123abz
; hcl:123abc

; ecl:brn
; ecl:wat

; pid:000000001
; pid:0123456789")

; valid case:
; hcl:#fffffd iyr:2013
; eyr:2026
; ecl:hzl pid:920076943 byr:1929
; hgt:168cm
(let input sample)
(let input (open "./playground/src/aoc_2020/4/input.txt"))
; 190
(function validate_fields fields (do fields (map (lambda x _ _ 
                        (do x (map (lambda y _ _ 
                          (do y (regex_match "byr|iyr|eyr|hgt|hcl|ecl|pid")))) 
                                (deep_flat)
                                (filter (lambda x _ _ (not (not x)))))))
                  ; (map (lambda x _ _ (log x)))
                  (filter (lambda x _ _ (= (length x) 7)))))
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
                                             (filter (lambda y _ _ (and (not (= (get y 0) "cid")) (regex_match (get y 0) "byr|iyr|eyr|hgt|hcl|ecl|pid")))))))))
(do input 
     (split_by_n_lines 2)
     (to_entries)
     (without_invalid_fields)
     (filter (lambda x _ _ (= (length x) 7)))
     (map (lambda x _ _ (do x     
      (map (lambda y _ _ (block
        (let key (get y 0))
        (let value (get y 1))
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
                    (and (length color) (= (length (... (get color 0))) 7)))
                  (if (= key "ecl")
                    (and (= (length arr) 3) (length (regex_match value "amb|blu|brn|gry|grn|hzl|oth")))
                    (if (= key "pid") 
                      (and 
                        (= (length arr) 9) 
                        (length (regex_match value "[0-9]{9}"))) ; (if (= key "cid") 1)
                        )))))))
                      )
                      ))))))
       (filter (lambda x _ _ (every x (lambda y _ _ (= (get y -1) 1)))))
      ;  (map (lambda x _ (reduce x (lambda a b _ _ (+ a (get b -1))) 0)))
      (map (lambda x _ _ (log x)))
      (length)
      (log)
    ;  (map (lambda x _ _ (log x)))
    ; (map (lambda x _ _ (every x (lambda y _ _ (= y 1)))))
    ; (sum_array)
        ; (log)
        )
  