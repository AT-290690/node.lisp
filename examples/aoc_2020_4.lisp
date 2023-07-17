(import std  "remove" "for-each" "push" "map" "regex-match" "split-by-n-lines" "deep-flat" "split-by" "join" "every" "reduce" "sum-array")

(defvar sample "ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

hcl:#7d3b0c iyr:2013
eyr:2026
ecl:oth pid:920076943 byr:1929
hgt:76in")

(defvar *input* sample)
; (defvar *input* (open "./playground/src/aoc_2020/4/input.txt"))

; 190
(defun validate_fields fields (go fields (map (lambda x . . 
                        (go x (map (lambda y . . 
                          (go y (regex-match "byr|iyr|eyr|hgt|hcl|ecl|pid")))) 
                                (deep-flat))))
                  (remove (lambda x . . (= (length x) 7)))))

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
(defun to_entries array (map array (lambda x . . (go x (map (lambda y . . (go y (split-by " ")))) (deep-flat) (map (lambda x . . (split-by x ":")))))))
(defun without_invalid_fields fields (go fields 
                                            (map (lambda x . . (go x 
                                             (remove (lambda y . . (and (not (= (car y) "cid")) (regex-match (car y) "byr|iyr|eyr|hgt|hcl|ecl|pid")))))))))


(Array 
(go *input* (split-by-n-lines 2)
                (validate_fields)
                  (length))
(go *input* 
     (split-by-n-lines 2)
     (to_entries)
     (without_invalid_fields)
     (remove (lambda x . . (= (length x) 7)))
     (map (lambda x . . (go x     
      (map (lambda y . . (do
        (defvar key (car y))
        (defvar value (car (cdr y)))
        (defvar arr (type value Array))
       (Array key value
        (cond 
          (= key "byr") (and (= (length arr) 4) (>= (type value Number) 1920) (<= (type value Number) 2002)) 
          (= key "iyr") (and (= (length arr) 4) (>= (type value Number) 2010) (<= (type value Number) 2020))
          (= key "eyr") (and (= (length arr) 4) (>= (type value Number) 2020) (<= (type value Number) 2030))
          (= key "hgt") (and (>= (length arr) 3) (do 
                  (defvar units (concatenate (get arr -2) (get arr -1)))
                  (defvar num (type (join (set arr -2) "") Number))
                    ; If cm, the number must be at least 150 and at most 193.
                    (if (= units "cm") (and (>= num 150) (<= num 193))
                      ; If in, the number must be at least 59 and at most 76.
                      (if (= units "in") (and (>= num 59) (<= num 76))))))
          (= key "hcl") (do 
                  (defvar color (regex-match value "#.+[0-9a-f]"))
                    (and (length color) (= (length (type (car color) Array)) 7)))
          (= key "ecl") (and (= (length arr) 3) (length (regex-match value "amb|blu|brn|gry|grn|hzl|oth")))
          (= key "pid") 
                      (and 
                        (= (length arr) 9) 
                        (length (regex-match value "[0-9]{9}")))))))))))
       (remove (lambda x . . (every x (lambda y . . (= (get y -1) 1)))))
      ; (map (lambda x . . (log x)))
      (length)))