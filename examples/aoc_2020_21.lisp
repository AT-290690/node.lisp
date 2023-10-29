(import str "split" "split-by-lines" "join")
(import ds "hash-set-intersection"  "hash-set-difference"  "hash-set-xor" "hash-index" "hash-set-add!" "array->set" "hash-set" "hash-table-remove!" "hash-set?"
  "hash-table-add!" "hash-table?" "hash-table-get" "hash-table" "hash-table-make" "hash-set-make"
   "hash-set-remove!" "hash-set-union")
(import std "fold" "index-of" "sort-by-length" "number-of"
"scan" "every?" "slice-if" "take" "all?" "sort"
"array-in-bounds?" "find-index" "adjacent-difference"
  "reduce" "push!" "select" "deep-flat" "for-each"
  "every?" "array-of-numbers" "map" "quick-sort" "zip" "any?"
  "some?" "find" "slice" "concat" "for-n" "for-of")
(import math "euclidean-mod")

(defconstant *input* "mxmxvkd kfcds sqjhc nhms contains dairy fish
trh fvjkl sbzzf mxmxvkd contains dairy
sqjhc fvjkl contains soy
sqjhc mxmxvkd sbzzf contains fish")
; (defconstant *input* (:open "./playground/src/aoc_2020/21/input.txt"))
(defconstant *table-size* 10)
(defconstant *parsed* (go 
  *input* 
  (split-by-lines) 
  (scan (lambda x 
            (go x 
                (split " contains ") 
                (scan (lambda y 
                          (go y (split " ")))))))))

(defconstant *alergens* (go 
  *parsed* 
  (fold (lambda table item 
        (do 
          (for-of (defconstant alergens (car (cdr item))) (lambda alergen (do 
          (defconstant ingridients (car item))  
            (if (hash-table? table alergen) (do
                (defconstant current (hash-table-get table alergen))
                (hash-table-add! table alergen (hash-set-intersection current (array->set ingridients) *table-size*))
              )
            (do 
              (hash-table-add! table alergen (array->set ingridients)))))))
            table))
          (hash-table *table-size*))))

(defconstant *size* (go *alergens* (take (lambda x (> (length x) 0))) (length)))
(defun solve items (do 
  (destructuring-bind alergens visited . items)
  (defconstant solved (go 
          alergens 
          (take (lambda x (> (length x) 0))) 
          (sort (lambda a b (if (< (go a (car) (cdr) (car) (number-of (lambda x (> (length x) 0)))) 
                              (go b (car) (cdr) (car) (number-of (lambda x (> (length x) 0))))) -1 1)))
          (take (lambda x (not (hash-set? visited (car (car x))))))
          (scan (lambda x (car x)))))
  (defconstant copy (go 
          alergens
          (take (lambda x (> (length x) 0)))
          (scan (lambda x (car x)))
          (fold (lambda a b (do 
            (destructuring-bind key value . b)
            (hash-table-add! a key value))) (hash-table *table-size*))))
  (destructuring-bind first rest solved)
  (destructuring-bind k current . first)
  (defconstant size (go current (number-of (lambda x (> (length x) 0)))))
  (when (length rest) (for-of rest (lambda box (do 
    (destructuring-bind key elements . box)
    (hash-table-add! copy key (if (= size 1) (hash-set-difference elements current *table-size*) (hash-set-make (deep-flat elements))))))))
  (when (= size 1) (hash-set-add! visited k))
  (if (< (go visited (deep-flat) (length)) *size*) (solve (Array copy visited)) (Array copy visited))))

; (go
; *alergens*
; (take (lambda x (> (length x) 0)))
; (scan (lambda x (log (Array (car (car x)) (deep-flat (cdr (car x))))))))

(defconstant app (go *parsed* (scan (lambda x (car x))) (deep-flat)))
(defconstant rem (go app (fold (lambda a b (hash-set-add! a b)) (hash-set *table-size*))))
(defconstant solved (solve (Array *alergens* (hash-set *table-size*))))
(defconstant solved-flatted (go solved (car) (take (lambda x (> (length x) 0)))))
(defconstant diff (go solved-flatted (scan (lambda x (car (cdr (car x))))) (deep-flat) (fold (lambda a b (hash-set-add! a b)) (hash-set *table-size*))))
(defconstant part1 (hash-set-difference rem diff *table-size*))
(Array 
(go app (fold (lambda a b (+ a (hash-set? part1 b))) 0))
(go 
  solved-flatted
  (scan (lambda x (car (car x))))
  (sort (lambda a b (if (> a b) 1 -1))) 
  (scan (lambda x (hash-table-get (car solved) x)))
  (deep-flat)
  (join ",")))