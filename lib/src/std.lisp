; (std lib)
(defun std (do
  ; modules
  ; push!  
  (deftype push! (Lambda (Or (Array)) (Or (Array) (Number) (Integer) (String) (Function)) (Or (Array))))
  (defun push! array value (set array (length array) value))
  ; pop!
  (deftype pop! (Lambda (Or (Array)) (Or (Array))))
  (defun pop! array (set array -1))
  ; drop!
  (deftype drop! (Lambda (Or (Array)) (Or (Array) (Number) (Integer) (String) (Function))))
  (defun drop! array (when (length array) (do (defconstant last (get array -1)) (set array -1) last)))
  ; array-in-bounds? 
  (deftype array-in-bounds? (Lambda (Or (Array)) (Or (Number)) (Or (Boolean))))
  (defun array-in-bounds? array index (and (< index (length array)) (>= index 0)))
  ; array-of-atoms?
  (deftype array-of-atoms? (Lambda (Or (Array)) (Or (Boolean))))
  (defun array-of-atoms? array (if (not (length array)) 1 (if (atom? (car array)) (array-of-atoms? (cdr array)) 0)))
  ; cartesian-product
  (deftype cartesian-product (Lambda (Or (Array)) (Or (Array)) (Or (Array (Array)))))
  (defun cartesian-product a b (reduce a (lambda p x . . (merge p (map b (lambda y . . (Array x y))))) (Array)))
  ; neighborhood
  (deftype neighborhood (Lambda (Or (Array (Array (Number)))) (Or (Array (Array (Number)))) (Or (Number)) (Or (Number)) (Or (Function)) (Or (Number))))
  (defun neighborhood array directions y x callback
      (reduce directions (lambda sum dir . . (do
          (defconstant
              dy (+ (car dir) y)
              dx (+ (car (cdr dir)) x))
          (+ sum (when (and (array-in-bounds? array dy) (array-in-bounds? (get array dy) dx)) (callback (get (get array dy) dx) dir))))) 0))
  ; repeat
  (deftype repeat (Lambda (Or (Number)) (Or (Function)) (Or (Array))))
  (defun repeat n fn (map (Array n length) (lambda . . . (fn))))
  ; array-of-numbers
  (deftype array-of-numbers (Lambda (Or (Array)) (Or (Array (Number)))))
  (defun array-of-numbers array (map array (lambda x . . (type x Number))))
  ; string->array
  (deftype string->array (Lambda (Or (String)) (Or (Array))))
  (defun string->array string (type string Array))
  ; array->string
  (deftype array->string (Lambda (Or (Array)) (Or (String))))
  (defun array->string array (reduce array (lambda a x i . (if (> i 0) (concatenate a (type x String)) (type x String))) ""))
  ; string->number
  (deftype string->number (Lambda (Or (String)) (Or (Number))))
  (defun string->number string (type string Number))
  ; number->string
  (deftype number->string (Lambda (Or (Number)) (Or (String))))
  (defun number->string number (type number String))
  ; string->integer
  (deftype string->integer (Lambda (Or (String)) (Or (Integer))))
  (defun string->integer string (type string Integer))
  ; integer->string
  (deftype integer->string (Lambda (Or (Integer)) (Or (String))))
  (defun integer->string integer (type integer String))
  ; number->integer
  (deftype number->integer (Lambda (Or (Number)) (Or (Integer))))
  (defun number->integer number (type number Integer))
  ; integer->number
  (deftype integer->number (Lambda (Or (Integer)) (Or (Number))))
  (defun integer->number integer (type integer Number))
  ; strings->integers
  (deftype strings->integers (Lambda (Or (Array (String))) (Or (Array (Integer)))))
  (defun strings->integers array (map array (lambda x . . (type x Integer))))
  ; integers->strings
  (deftype integers->strings (Lambda (Or (Array (Integer))) (Or (Array (String)))))
  (defun integers->strings array (map array (lambda x . . (type x String))))
  ; strings->numbers
  (deftype strings->numbers (Lambda (Or (Array (String))) (Or (Array (Number)))))
  (defun strings->numbers array (map array (lambda x . . (type x Number))))
  ; numbers->strings
  (deftype numbers->strings (Lambda (Or (Array (Number))) (Or (Array (String)))))
  (defun numbers->strings array (map array (lambda x . . (type x String))))
  ; concat
  (deftype concat (Lambda (Or (Array)) (Or (Array)) (Or (Array))))
  (defun concat array1 array2 (do
    (loop defun iterate i bounds (do
    (when (< i (length array2)) (set array1 (length array1) (get array2 i)))
    (if (< i bounds) (iterate (+ i 1) bounds) array1)))
  (iterate 0 (- (length array2) 1))))
  ; merge
  (deftype merge (Lambda (Or (Array)) (Or (Array)) (Or (Array))))
  (defun merge array1 array2 (do
    (loop defun iterate i bounds (do
    (set array1 (length array1) (get array2 i))
    (if (< i bounds) 
      (iterate (+ i 1) bounds)
    array1)))
  (iterate 0 (- (length array2) 1))))
  ; map
  (deftype map (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
  (defun map array callback (do
    (defconstant new-array (Array))
    (defvar i 0)
    (loop defun iterate i bounds (do
      (set new-array i (callback (get array i) i array))
      (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
    (iterate 0 (- (length array) 1))))
  ; for-each
  (deftype for-each (Lambda (Or (Array)) (Or (Function)) (Or (Array) (Number) (Integer) (String) (Function))))
  (defun for-each array callback (do
    (loop defun iterate i bounds (do
      (callback (get array i) i array)
      (if (< i bounds) (iterate (+ i 1) bounds) array)))
    (iterate 0 (- (length array) 1))))
  ; for-each-rev
  (deftype for-each-rev (Lambda (Or (Array)) (Or (Function)) (Or (Array) (Number) (Integer) (String) (Function))))
  (defun for-each-rev array callback (do
    (loop defun iterate i bounds (do
      (callback (get array i) i array)
      (if (> i bounds) (iterate (- i 1) bounds) array)))
    (iterate (- (length array) 1) 0)))
  ; for-of
  (deftype for-of (Lambda (Or (Array)) (Or (Function)) (Or (Array) (Number) (Integer) (String) (Function))))
  (defun for-of array callback (do
    (loop defun iterate i bounds (do
      (callback (get array i))
      (if (< i bounds) (iterate (+ i 1) bounds) array)))
    (iterate 0 (- (length array) 1))))
    ; for-of-rev
  (deftype for-of-rev (Lambda (Or (Array)) (Or (Function)) (Or (Array) (Number) (Integer) (String) (Function))))
  (defun for-of-rev array callback (do
    (loop defun iterate i bounds (do
      (callback (get array i))
      (if (> i bounds) (iterate (- i 1) bounds) array)))
    (iterate (- (length array) 1) 0)))
  ; for-n
  (deftype for-n (Lambda (Or (Number)) (Or (Function)) (Or (Array) (Number) (Integer) (String) (Function))))
  (defun for-n N callback (do
    (loop defun iterate i (do 
        (defconstant res (callback i))
        (if (< i N) (iterate (+ i 1)) res))) 
        (iterate 0)))
  ; for-range
  (deftype for-range (Lambda (Or (Number)) (Or (Number)) (Or (Function)) (Or (Array) (Number) (Integer) (String) (Function))))
  (defun for-range start end callback (do
    (loop defun iterate i (do 
        (defconstant res (callback i))
        (if (< i end) (iterate (+ i 1)) res))) 
        (iterate start)))
  ; count-of
  (deftype count-of (Lambda (Or (Array)) (Or (Function)) (Or (Number))))
  (defun count-of array callback (do
    (defvar amount 0)
    (loop defun iterate i bounds (do
      (defconstant current (get array i))
      (when (callback current i array) (setf amount (+ amount 1)))
      (if (< i bounds) (iterate (+ i 1) bounds) amount)))
    (iterate 0 (- (length array) 1))))
    ; count-of
  (deftype number-of (Lambda (Or (Array)) (Or (Function)) (Or (Number))))
  (defun number-of array callback (do
    (defvar amount 0)
    (loop defun iterate i bounds (do
      (defconstant current (get array i))
      (when (callback current) (setf amount (+ amount 1)))
      (if (< i bounds) (iterate (+ i 1) bounds) amount)))
    (iterate 0 (- (length array) 1))))
  ; partition 
  (deftype partition (Lambda (Or (Array)) (Or (Number)) (Or (Array (Array)))))
  (defun partition array n (reduce array (lambda a x i . (do 
        (if (mod i n) (set (defconstant last-a (get a -1)) (length last-a) x) (set a (length a) (Array x))) a)) 
        ()))
  ; select
  (deftype select (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
  (defun select array callback (do
    (defconstant new-array (Array))
    (loop defun iterate i bounds (do
      (defconstant current (get array i))
      (when (callback current i array) 
        (set new-array (length new-array) current))
      (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
    (iterate 0 (- (length array) 1))))
; take
(deftype take (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
(defun take array callback (do 
  (loop defun iterate arr output
    (if (length arr) (iterate (cdr arr) (if (callback (car arr)) (set output (length output) (car arr)) output)) output))
  (iterate array ())))
; take-until
(defun take-until-documentation
  (documentation 
    std
    take-until
    ()
    (case "take-until even numbers" (take-until (Array 2 4 6 3 1) (lambda x (= (mod x 2) 0))) (Array 2 4 6))
    "Create a new array and fill it with items until the item for which the predicate first fails"))
(deftype take-until (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
(defun take-until array callback (do 
  (defvar is-taking 1)
  (loop defun iterate arr output
    (if (and is-taking (length arr)) (iterate (cdr arr) (if (callback (car arr)) (set output (length output) (car arr)) (do (boole is-taking 0) output))) output))
  (iterate array ())))
; scan
(deftype scan (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
(defun scan arr callback (do 
  (loop defun iterate arr output
    (if (length arr) (iterate (cdr arr) (set output (length output) (callback (car arr)))) output))
  (iterate arr ())))
; fold 
(deftype fold (Lambda (Or (Array)) (Or (Function)) (Or (Array) (Number) (Integer) (String)) (Or (Array) (Number) (Integer) (String))))
(defun fold arr callback initial (do 
  (loop defun iterate arr output
    (if (length arr) (iterate (cdr arr) (setf output (callback output (car arr)))) output))
  (iterate arr initial)))
; zip
(deftype zip (Lambda (Or (Array)) (Or (Array)) (Or (Array (Array)))))
(defun zip A B (do 
  (loop defun iterate a b output
    (if (and (length a) (length b)) (iterate (cdr a) (cdr b) (set output (length output) (Array (car a) (car b)))) output))
  (iterate A B ())))
  ; except
  (deftype except (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
  (defun except array callback (do
    (defconstant new-array (Array))
    (loop defun iterate i bounds (do
      (defconstant current (get array i))
      (otherwise (callback current i array) 
        (set new-array (length new-array) current))
      (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
    (iterate 0 (- (length array) 1))))
  ; keep
  (deftype keep (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
  (defun keep array callback (do
    (defconstant new-array (Array))
    (loop defun iterate i bounds (do
      (defconstant current (get array i))
      (when (callback current) 
        (set new-array (length new-array) current))
      (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
    (iterate 0 (- (length array) 1))))
  ; remmove
  (deftype remove (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
  (defun remove array callback (do
    (defconstant new-array (Array))
    (loop defun iterate i bounds (do
      (defconstant current (get array i))
      (otherwise (callback current) 
        (set new-array (length new-array) current))
      (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
    (iterate 0 (- (length array) 1))))
  ; every?
  (deftype every? (Lambda (Or (Array)) (Or (Function)) (Or (Boolean))))
  (defun every? array callback (do
      (defvar bol 1)
      (loop defun iterate i bounds (do
        (defconstant res (callback (get array i) i array))
        (boole bol (type res Boolean))
        (if (and res (< i bounds)) (iterate (+ i 1) bounds) bol)))
      (iterate 0 (- (length array) 1))))
  ; some?
  (deftype some? (Lambda (Or (Array)) (Or (Function)) (Or (Boolean))))
  (defun some? array callback (do
      (defvar bol 1)
      (loop defun iterate i bounds (do
        (defconstant res (callback (get array i) i array))
        (boole bol (type res Boolean))
        (if (and (not res) (< i bounds)) (iterate (+ i 1) bounds) bol)))
      (iterate 0 (- (length array) 1))))
  ; all?
  (deftype all? (Lambda (Or (Array)) (Or (Function)) (Or (Boolean))))
  (defun all? array callback (do
      (defvar bol 1)
      (loop defun iterate i bounds (do
        (defconstant res (callback (get array i)))
        (boole bol (type res Boolean))
        (if (and res (< i bounds)) (iterate (+ i 1) bounds) bol)))
      (iterate 0 (- (length array) 1))))
  ; any?
  (deftype any? (Lambda (Or (Array)) (Or (Function)) (Or (Boolean))))
  (defun any? array callback (do
      (defvar bol 1)
      (loop defun iterate i bounds (do
        (defconstant res (callback (get array i)))
        (boole bol (type res Boolean))
        (if (and (not res) (< i bounds)) (iterate (+ i 1) bounds) bol)))
      (iterate 0 (- (length array) 1))))
  ; reduce
  (deftype reduce (Lambda (Or (Array)) (Or (Function)) (Or (Array) (Number) (Integer) (String)) (Or (Array) (Number) (Integer) (String))))
  (defun reduce array callback initial (do
    (loop defun iterate i bounds (do
      (setf initial (callback initial (get array i) i array))
      (if (< i bounds) (iterate (+ i 1) bounds) initial)))
    (iterate 0 (- (length array) 1))))
    ; accumulate
    (deftype accumulate (Lambda (Or (Array)) (Or (Function)) (Or (Array) (Number) (Integer) (String))))
    (defun accumulate array callback (do
      (defvar initial (get array 0))
      (loop defun iterate i bounds (do
        (setf initial (callback initial (get array i) i array))
        (if (< i bounds) (iterate (+ i 1) bounds) initial)))
      (iterate 0 (- (length array) 1))))
    ; iteration 
    (deftype iteration (Lambda (Or (Function)) (Or (Number)) (Or (Array))))
    (defun iteration callback n (reduce (defconstant arr (Array n length)) (lambda a . i . (set a i (callback (get a -1) i))) arr))
    ; iteration 
    (defun repeated-apply initial callback i (do 
      (loop defun iterate result callback i (if (> i 0) (iterate (callback result) callback (- i 1)) result))
      (iterate initial callback i)))
    ; deep-flat
    (deftype deep-flat (Lambda (Or (Array)) (Or (Array))))
    (defun deep-flat arr (do 
      (defconstant new-array (Array)) 
      (defconstant flatten (lambda item 
        (if (and (Array? item) (length item)) 
              (for-each item (lambda x . . (flatten x))) 
              (otherwise (Array? item) (set new-array (length new-array) item)))))
      (flatten arr) 
      new-array))
    ; fetch
    (deftype fetch (Lambda (Or (Array)) (Or (Function)) (Or (Array) (Number) (Integer) (String) (Function))))
    (defun fetch array callback (do
            (loop defun iterate i bounds (do
              (defconstant 
                current (get array i)
                has (callback current))
              (if (and (not has) (< i bounds))
                (iterate (+ i 1) bounds) 
                (when has current))))
                (iterate 0 (- (length array) 1))))
     ; find
    (deftype find (Lambda (Or (Array)) (Or (Function)) (Or (Array) (Number) (Integer) (String) (Function))))
    (defun find array callback (do
            (loop defun iterate i bounds (do
              (defconstant 
                current (get array i) 
                has (callback current i array))
              (if (and (not has) (< i bounds))
                (iterate (+ i 1) bounds) 
                (when has current))))
                (iterate 0 (- (length array) 1))))
    ; find-index
    (deftype find-index (Lambda (Or (Array)) (Or (Function)) (Or (Number))))
    (defun find-index array callback (do
      (defvar idx -1 has-found 0)
      (loop defun iterate i bounds (do
        (defconstant current (get array i))
        (boole has-found (callback current i array))
        (if (and (not has-found) (< i bounds))
          (iterate (+ i 1) bounds) 
          (setf idx i))))
          (iterate 0 (- (length array) 1))
          (if has-found idx -1)))
    ; index-of
    (deftype index-of (Lambda (Or (Array)) (Or (Number) (Integer) (String)) (Or (Number))))
    (defun index-of array target (do
      (defvar idx -1 has-found 0)
      (loop defun iterate i bounds (do
        (defconstant current (get array i))
        (boole has-found (and (atom? current) (= target current)))
        (if (and (not has-found) (< i bounds))
          (iterate (+ i 1) bounds) 
          (setf idx i))))
          (iterate 0 (- (length array) 1))
          (if has-found idx -1)))
      ; last-index-of
      (deftype last-index-of (Lambda (Or (Array)) (Or (Number) (Integer) (String)) (Or (Number))))
      (defun last-index-of array target (do
        (defvar idx -1 has-found 0)
        (loop defun iterate i (do
          (defconstant current (get array i))
          (boole has-found (= target current))
          (if (and (not has-found) (>= i 0))
            (iterate (- i 1)) 
            (setf idx i))))
            (iterate (- (length array) 1))
            (if has-found idx -1)))
      ; index-of-starting-from
    (deftype index-of-starting-from (Lambda (Or (Array)) (Or (Number) (Integer) (String)) (Or (Number)) (Or (Number))))
    (defun index-of-starting-from array target start (do
      (defvar idx -1 has-found 0)
      (loop defun iterate i bounds (do
        (defconstant current (get array i))
        (boole has-found (= target current))
        (if (and (not has-found) (< i bounds))
          (iterate (+ i 1) bounds) 
          (setf idx i))))
          (iterate start (- (length array) 1))
          (if has-found idx -1)))
      ; last-index-of-ending-from
      (deftype last-index-of-ending-from (Lambda (Or (Array)) (Or (Number) (Integer) (String)) (Or (Number)) (Or (Number))))
      (defun last-index-of-ending-from array target end (do
        (defvar idx -1 has-found 0)
        (loop defun iterate i (do
          (defconstant current (get array i))
          (boole has-found (= target current))
          (if (and (not has-found) (>= i 0))
            (iterate (- i 1)) 
            (setf idx i))))
            (iterate (- (length array) 1 (* end -1)))
            (if has-found idx -1)))
      ; array-index-of
      (deftype array-index-of (Lambda (Or (Array)) (Or (Number) (Integer) (String)) (Or (Number))))
      (defun array-index-of array target 
        (do
          (if (= (length array) 0) -1 
            (do 
              (defvar idx -1 has-found 0)
              (loop defun iterate i bounds (do
                (defconstant current (get array i))
                (boole has-found (= target current))
                (if (and (not has-found) (< i bounds))
                  (iterate (+ i 1) bounds) 
                  (setf idx i))))
                  (iterate 0 (- (length array) 1))
                  (if has-found idx -1)))))
      ; quick-sort
      (defun quick-sort-documentation
      (documentation 
        std
        quick-sort
        (Array (import std "concat"))
        (case "sort (2 1 3)" (quick-sort (Array 2 1 3)) (Array 1 2 3))
      "Sorts an array of strings or numbers.\n The order is ascending.\n This creates a copy of the array."))
      (deftype quick-sort (Lambda (Or (Array (Number)) (Array (String)) (Array (Integer))) (Or (Array (Number)) (Array (String)) (Array (Integer)))))
      (defun quick-sort arr (do
        (if (<= (length arr) 1) arr
        (do
          (defconstant 
            pivot (car arr) 
            left-arr (Array) 
            right-arr (Array))
        (loop defun iterate i bounds (do
          (defconstant current (get arr i))
          (if (< current pivot) 
              (set left-arr (length left-arr) current)
              (set right-arr (length right-arr) current))
          (when (< i bounds) (iterate (+ i 1) bounds))))
          (iterate 1 (- (length arr) 1))
      (defconstant left-sorted (quick-sort left-arr))
      (go 
        left-sorted
        (set (length left-sorted) pivot)
        (concat (quick-sort right-arr)))))))

  ; sort
  (defun sort-documentation
  (documentation 
    std
    sort
    (Array (import std "concat"))
    (case "sort (2 1 3)" (sort (Array 2 1 3) (lambda a b (if (> a b) 1 -1))) (Array 1 2 3))
  "Sorts an array of strings or numbers.\n The order is ascending.\n This creates a copy of the array."))
  ; (deftype sort (Lambda (Or (Array (Number)) (Array (String)) (Array (Integer))) (Or (Function)) (Or (Array (Number)) (Array (String)) (Array (Integer)))))
  (defun sort arr callback (do
        (if (<= (length arr) 1) arr
        (do
          (defconstant 
            pivot (car arr) 
            left-arr (Array) 
            right-arr (Array))
        (loop defun iterate i bounds (do
          (defconstant current (get arr i))
          (defconstant predicate (callback current pivot))
          (cond 
            (= predicate -1) (set left-arr (length left-arr) current)
            (= predicate 1)  (set right-arr (length right-arr) current)
            (*) (throw "(sort) predicate has to return (or 1 -1)"))
          (when (< i bounds) (iterate (+ i 1) bounds))))
          (iterate 1 (- (length arr) 1))
      (defconstant left-sorted (sort left-arr callback))
      (go 
        left-sorted
        (set (length left-sorted) pivot)
        (concat (sort right-arr callback)))))))
      ; reverse 
    (defun reverse-documentation
      (documentation 
        std
        reverse
        ()
        (case "reverse 1 x (1 2 3)" (reverse (Array 1 2 3)) (Array 3 2 1))
        (case "reverse 2 x (1 2 3)" (reverse (reverse (Array 1 2 3))) (Array 1 2 3))
      "Reverse an array.\n This creates a copy of the array."))
      (deftype reverse (Lambda (Or (Array)) (Or (Array))))
      (defun reverse array (do
        (defconstant len (length array))
        (if (> len 1) (do
        (defconstant 
          reversed (Array len length)
          offset (- len 1))
        (loop defun iterate i bounds (do
          (set reversed (- offset i) (get array i))
          (if (< i bounds) (iterate (+ i 1) bounds) reversed)))
        (iterate 0 offset)) array)))
      ; empty!
      (deftype empty! (Lambda (Or (Array)) (Or (Array))))
      (defun empty! array (do (loop defun iterate (if (length array) (do (set array -1) (iterate)) array)) (iterate)))
      ; empty?
      (deftype empty? (Lambda (Or (Array)) (Or (Boolean))))
      (defun empty? array (not (length array)))
      ; binary-search
      (deftype binary-search (Lambda (Or (Array)) (Or (Number) (Integer) (String)) (Or (Number) (Integer) (String) (Array))))
      (defun binary-search 
              array target (do
        (loop defun search 
              arr target start end (do
          (when (<= start end) (do 
              (defconstant 
                index (| (* (+ start end) 0.5) 0)
                current (get arr index))
              (if (= target current) target
                (if (> current target) 
                  (search arr target start (- index 1))
                  (search arr target (+ index 1) end))))))) 
        (search array target 0 (length array))))
      ; sort-by-length 
      (deftype sort-by-length (Lambda (Or (Array)) (Or (Array (Number))) (Or (Array))))
      (defun sort-by-length array order (go order (map (lambda x . . (find array (lambda y . . (= (- (length y) 1) x)))))))
      ; order-array
      (deftype order-array (Lambda (Or (Array)) (Or (Array (Number))) (Or (Array))))
      (defun order-array array order (map (Array (length array) length) (lambda . i . (get array (get order i)))))
      ; slice 
      (deftype slice (Lambda (Or (Array)) (Or (Number)) (Or (Number)) (Or (Array))))
      (defun slice array start end (do 
        (defconstant bounds (- end start) out (Array bounds length))
        (loop defun iterate i 
          (if (< i bounds) 
              (do 
                (set out i (get array (+ start i))) 
                (iterate (+ i 1)))
              out))
              (iterate 0)))
      ; clone
      (deftype clone (Lambda (Or (Array)) (Or (Array))))
      (defun clone array (do 
      (defconstant 
              bounds (length array) 
              out (Array bounds length))
        (loop defun iterate i 
          (if (< i bounds) 
              (do 
                (defconstant current (get array i))
                (set out i (if (Array? current) (clone current) current)) 
                (iterate (+ i 1)))
              out))
              (iterate 0)))
      ; slice-if-index
      (deftype slice-if-index (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
      (defun slice-if-index array callback (reduce array (lambda a b i . (if (callback i) (set a (length a) b) a)) (Array)))
      ; slice-if
      (deftype slice-if (Lambda (Or (Array)) (Or (Function)) (Or (Array))))
      (defun slice-if array callback (reduce array (lambda a b i . (if (callback b i) (set a (length a) b) a)) (Array)))
      ; window
      (deftype window (Lambda (Or (Array)) (Or (Number)) (Or (Array (Array)))))
      (defun window array n (go array
        (reduce (lambda acc current i all 
          (if (>= i n) 
            (set acc (length acc) (slice all (- i n) i)) acc)) (Array))))
      ; equal 
      (deftype equal? (Lambda (Or (Array) (Number) (Integer) (String)) (Or (Array) (Number) (Integer) (String)) (Or (Boolean))))
      (defun equal? a b 
      (or (and (atom? a) (atom? b) (= a b)) 
      (and (Array? a) 
            (= (length a) (length b)) 
              (not (some? a (lambda . i . (not (equal? (get a i) (get b i)))))))))
    ; adjacent-difference
    (deftype adjacent-difference (Lambda (Or (Array (Number)) (Array (String)) (Array (Array))) (Or (Function)) (Or (Array (Number)) (Array (String)) (Array (Array)))))
    (defun adjacent-difference array callback (do 
      (defconstant len (length array))
      (unless (= len 1) 
        (do (defconstant result (Array (car array)))
        (loop defun iterate i (if (< i len) (do 
        (set result i (callback (get array (- i 1)) (get array i)))
        (iterate (+ i 1))) result))
        (iterate 1)) array)))
; fill
(deftype fill (Lambda (Or (Array)) (Or (String) (Number) (Integer) (Boolean)) (Or (Array))))
(defun fill arr item (do 
  (loop defun iterate arr output
  (if (length arr) (iterate (cdr arr) (set output (length output) item)) output))
  (iterate arr ())))
; rotate-square-matrix
(defun rotate-square-matrix-documentation
      (documentation 
        std
        rotate-square-matrix
        ()
        (case "rotate-square-matrix 1 x ((1 2) (1 2))" (rotate-square-matrix (' (' 1 2) (' 1 2))) (' (' 2 2) (' 1 1)))
        (case "rotate-square-matrix 2 x ((1 2) (1 2))" (rotate-square-matrix (rotate-square-matrix (' (' 1 2) (' 1 2)))) (' (' 2 1) (' 2 1)))
        (case "rotate-square-matrix 3 x ((1 2) (1 2))" (rotate-square-matrix (rotate-square-matrix (rotate-square-matrix (' (' 1 2) (' 1 2))))) (' (' 1 1) (' 2 2)))
        (case "rotate-square-matrix 4 x ((1 2) (1 2))" (rotate-square-matrix (rotate-square-matrix (rotate-square-matrix (rotate-square-matrix (' (' 1 2) (' 1 2)))))) (' (' 1 2) (' 1 2)))
      "Reverse an array.\n This creates a copy of the array."))
(deftype rotate-square-matrix (Lambda (Or (Array (Array))) (Or (Array (Array)))))
(defun rotate-square-matrix array (do 
  (defconstant 
              len (length array)
              out (Array len length))
  (loop defun outer row 
    (when (< row len) (do 
      (set out row ())
     (loop defun inner col 
      (when (< col len) (do 
        (set (get out row) col (get (get array col) (- len 1 row)))
        (inner (+ col 1)))))
        (inner 0)
    (outer (+ row 1)))))
    (outer 0)
    out))
; flip-square-matrix
(defun flip-square-matrix-documentation
      (documentation 
        std
        flip-square-matrix
        ()
        (case "flip-square-matrix 1 x ((1 2) (1 2))" (flip-square-matrix (' (' 1 2) (' 1 2))) (' (' 2 1) (' 2 1)))
        (case "flip-square-matrix 2 x ((1 2) (1 2))" (flip-square-matrix (flip-square-matrix (' (' 1 2) (' 1 2)))) (' (' 1 2) (' 1 2)) )
      "Reverse an array.\n This creates a copy of the array."))
(deftype flip-square-matrix (Lambda (Or (Array (Array))) (Or (Array (Array)))))
(defun flip-square-matrix array (do 
  (defconstant 
              len (length array)
              out (Array len length))
  (loop defun outer row 
    (when (< row len) (do 
      (set out row ())
     (loop defun inner col 
      (when (< col len) (do 
        (set (get out row) col (get (get array row) (- len 1 col)))
        (inner (+ col 1)))))
        (inner 0)
    (outer (+ row 1)))))
    (outer 0)
    out))

    (Array 
      (Array "push!" push!)
      (Array "pop!" pop!)
      (Array "drop!" drop!)
      (Array "sort-by-length" sort-by-length)  
      (Array "order-array" order-array)  
      (Array "array-in-bounds?" array-in-bounds?)  
      (Array "array-of-numbers" array-of-numbers)
      (Array "concat" concat)
      (Array "merge" merge)
      (Array "map" map)
      (Array "for-each" for-each)
      (Array "for-n" for-n)
      (Array "for-range" for-range)
      (Array "select" select)
      (Array "except" except)
      (Array "keep" keep)
      (Array "remove" remove)
      (Array "reduce" reduce)
      (Array "deep-flat" deep-flat)
      (Array "find" find)
      (Array "find-index" find-index)
      (Array "quick-sort" quick-sort)
      (Array "sort" sort)
      (Array "reverse" reverse)
      (Array "binary-search" binary-search)
      (Array "every?" every?)
      (Array "some?" some?)
      (Array "index-of" index-of)
      (Array "last-index-of" last-index-of)
      (Array "index-of-starting-from" index-of-starting-from)
      (Array "last-index-of-ending-from" last-index-of-ending-from)
      (Array "array-index-of" array-index-of)
      (Array "accumulate" accumulate)
      (Array "count-of" count-of)
      (Array "partition" partition)
      (Array "slice" slice)
      (Array "slice-if" slice-if)
      (Array "slice-if-index" slice-if-index)
      (Array "equal?" equal?)
      (Array "neighborhood" neighborhood)
      (Array "repeat" repeat)
      (Array "window" window)
      (Array "cartesian-product" cartesian-product)
      (Array "repeated-apply" repeated-apply)
      (Array "iteration" iteration)
      (Array "clone" clone)
      (Array "empty!" empty!)
      (Array "empty?" empty?)
      (Array "take" take)
      (Array "zip" zip)
      (Array "scan" scan)
      (Array "fold" fold)
      (Array "fetch" fetch)
      (Array "any?" any?)
      (Array "all?" all?)
      (Array "number-of" number-of)
      (Array "for-of" for-of)
      (Array "adjacent-difference" adjacent-difference)
      (Array "for-of-rev" for-of-rev)
      (Array "for-each-rev" for-each-rev)
      (Array "fill" fill)
      (Array "rotate-square-matrix" rotate-square-matrix)
      (Array "flip-square-matrix" flip-square-matrix)
      (Array "take-until" take-until)
      
      (Array "strings->numbers" strings->numbers)
      (Array "numbers->strings" numbers->strings)
      (Array "strings->integers" strings->integers)
      (Array "integers->strings" integers->strings)
      (Array "array->string" array->string)
      (Array "string->array" string->array)
      (Array "string->number" string->number)
      (Array "number->string" number->string)
      (Array "string->integer" string->integer)
      (Array "integer->string" integer->string)
      (Array "number->integer" number->integer)
      (Array "integer->number" integer->number)

      ; documentation
      (Array "sort-documentation" sort-documentation)
      (Array "reverse-documentation" reverse-documentation)
      (Array "quick-sort-documentation" quick-sort-documentation)
      (Array "rotate-square-matrix-documentation" rotate-square-matrix-documentation)
      (Array "flip-square-matrix-documentation" flip-square-matrix-documentation)
      (Array "take-until-documentation" take-until-documentation)
  )))
; (/ std lib)