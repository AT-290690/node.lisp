; (std lib)
(defun std (do 
  ; modules
  ; max
  (defun max a b (if (> a b) a b))
  ; min
  (defun min a b (if (< a b) a b))
  ; maximum
  (defun maximum array (reduce array (lambda a b . . (max a b)) -9007199254740991))
  ; minimum
  (defun minimum array (reduce array (lambda a b . . (min a b)) 9007199254740991))
  ; normalize 
  (defun normalize value min max (* (- value min) (/ (- max min))))
  ; linear-interpolation
  (defun linear-interpolation a b n (+ (* (- 1 n) a) (* n b)))
  ; gauss-sum
  (defun gauss-sum n (* n (+ n 1) 0.5))
  ; gauss-sum-sequance
  (defun gauss-sum-sequance a b (* (+ a b) (+ (- b a) 1) 0.5))
  ; clamp
  (defun clamp x limit (if (> x limit) limit x))
  ; is-odd
  (defun is-odd x (= (mod x 2) 1))
  ; is-even
  (defun is-even x (= (mod x 2) 0))
  ; sign 
  (defun sign n (if (< n 0) -1 1))
  ; radians
  (defun radians deg (* deg 3.141592653589793 (/ 180)))
  ; binomial-coefficient
  (defun binomial-coefficient n k 
    (or 
      (cond 
        (or (< k 0) (> k n)) 0
        (or (= k 0) (= k n)) 1
        (or (= k 1) (= k (- n 1))) n) (do 
          (when (< (- n k) k) (setf k (- n k)))
          (loop defun iterate i res (if (<= i k) (iterate (+ i 1) (* res (- n i -1) (/ i))) res))
          (round (iterate 2 n)))))
  ; sin
  (defun sin rad terms (do
    (defvar sine 0)
    (loop defun inc i 
      (do 
        (setf sine 
          (+ sine 
            (* 
              (/ (factorial (+ (* 2 i) 1))) 
              (power -1 i) 
              (power rad (+ (* 2 i) 1))))) 
        (if (< i terms) (inc (+ i 1)) sine)))
      (inc 0)))
   ; cos 
  (defun cos rad terms (do
    (defvar cosine 0)
    (loop defun inc i 
      (do 
        (setf cosine 
          (+ cosine 
            (* 
              (/ (factorial (* 2 i))) 
              (power -1 i) 
              (power rad  (* 2 i))))) 
        (if (< i terms) (inc (+ i 1)) cosine)))
    (inc 0)))
  ; square
  (defun square x (* x x))
  ; average
  (defun average x y (* (+ x y) 0.5))
 ; sqrt
  (defun sqrt x (do 
    (defconstant is-good-enough (lambda g x (< (abs (- (square g) x)) 0.01))
         improve-guess (lambda g x (average g (* x (/ g)))))
    (loop defun sqrt-iter g x 
        (if (is-good-enough g x) 
            g
            (sqrt-iter (improve-guess g x) x)))
  (sqrt-iter 1.0 x)))
  ; can-sum
  (defun can-sum t values 
    (if (< t 0) 0 
      (if (= t 0) 1 
        (some values (lambda x . . (can-sum (- t x) values))))))
  ; how-can-sum
  (defun how-can-sum t values 
    (if (< t 0) 0 
      (if (= t 0) () 
        (do 
          (defvar res 0)
          (some values (lambda x . . (do 
            (setf res (how-can-sum (- t x) values))
            (if (and (Arrayp res) (= -1 (array-index-of res x))) (push res x))))) 
          res))))
  ; push  
  (defun push array value (set array (length array) value))
  ; pop
  (defun pop array (set array -1))
  ; array-in-bounds-p 
  (defun array-in-bounds-p array index (and (< index (length array)) (>= index 0)))
  ; is-array-of-atoms
  (defun is-array-of-atoms array (if (not (length array)) 1 (if (atom (car array)) (is-array-of-atoms (cdr array)) 0)))
  ; abs
  (defun abs n (- (^ n (>> n 31)) (>> n 31)))
  ; max-bit
  (defun max-bit a b (- a (& (- a b) (>> (- a b) 31))))
  ; max-bit
  (defun min-bit a b (- a (& (- a b) (>> (- b a) 31))))
  ; clamp-bit
  (defun clamp-bit x min max (do 
     (setf x (- x (& (- x max) (>> (- max x) 31))))
     (- x (& (- x min) (>> (- x min) 31)))))
  ; is-bit-power-of-two ; (and x (not (& x (- x 1)))
  (defun is-bit-power-of-two value 
    (and 
      (= (& value (- value 1)) 0) 
      (not (= value 0))))
   ; average-bit 
  (defun average-bit a b (>> (+ a b) 1))
  ; toggle-bit
  (defun toggle-bit n a b (^ a b n))
  ; is-odd-bit
  (defun is-odd-bit n (= (& n 1) 1))
  ; is-same-sign-bit 
  (defun is-same-sign-bit a b (>= (^ a b) 0))
  ; modulo-bit
  (defun modulo-bit numerator divisor (& numerator (- divisor 1)))
  ; set-bit
  (defun set-bit n bit (| n (<< 1 bit)))
  ; clear-bit
  (defun clear-bit n bit (& n (~ (<< 1 bit))))
  ; power-of-two-bit
  (defun power-of-two-bit n (<< 2 (- n 1)))
  ; count-number-of-ones-bit
  (defun count-number-of-ones-bit n (do 
    (defvar count 0)
    (loop defun iter 
      (if n (do 
        (setf n (& n (- n 1)))
        (setf count (+ count 1))
        (iter)) count))
    (iter)))
  ; check-n-is-one-bit
  (defun check-n-is-one-bit N nth (type (& N (<< 1 nth)) Boolean))
  (defun possible-subsets-bit A (do 
    (defconstant 
          items () 
          N (length A))
    (defun iter-i i (do
      (when (< i (<< 1 N)) (do 
        (defconstant current ())
        (set items (length items) current)
        (iter-j 0 (lambda j (do (when (& i (<< 1 j)) (set current (length current) (get A j))))))
        (iter-i (+ i 1)))))) 
    (defun iter-j j cb (when (< j N) (do (cb j) (iter-j (+ j 1) cb)))) (iter-i 0) items))
  ; largest-power 
  (defun largest-power N (do 
    ; changing all right side bits to 1.
    (setf N (| N (>> N 1)))
    (setf N (| N (>> N 2)))
    (setf N (| N (>> N 4)))
    (setf N (| N (>> N 8)))
    ; as now the number is 2 * x-1,
    ; where x is required answer,
    ; so adding 1 and dividing it by
    (>> (+ N 1) 1)))
  ; floor
  (defun floor n (| n 0))
  ; round a number
  (defun round n (| (+ n 0.5) 0))
  ; euclidean-mod
  (defun euclidean-mod a b (mod (+ (mod a b) b) b))
  ; euclidean-div
  (defun euclidean-div a b (do 
                      (defconstant q (* a (/ b)))
                      (if (< (mod a b) 0) (if (> b 0) (- q 1) (+ q 1)) q)))
  ; euclidean-distance
  (defun euclidean-distance x1 y1 x2 y2 (do
    (defconstant 
      a (- x1 x2) 
      b (- y1 y2))
    (sqrt (+ (* a a) (* b b)))))
  ; manhattan-distance
  (defun manhattan-distance x1 y1 x2 y2 (+ (abs (- x2 x1)) (abs (- y2 y1))))
  ; power
  (defun power base exp 
    (if (< exp 0) 
        (if (= base 0) 
        (throw "Attempting to divide by 0 in (power)")
        (/ (* base (power base (- (* exp -1) 1))))) 
        (if (= exp 0) 1
          (if (= exp 1) base
            (* base (power base (- exp 1)))))))
  ; levenshtein-distance
  (defun levenshtein-distance a b (do 
    (defconstant s (type a Array) 
            t (type b Array)) 
      
      (or (cond 
        (not (length s)) (length t)
        (not (length t)) (length a)
      ) (do 
        (defconstant arr ())
        (loop defun iterate-i i (when (<= i (length s)) (do
          (set arr i (Number i))
          (loop defun iterate-j j (when (<= j (length t)) (do 
            (set (get arr i) j 
              (if (= i 0) j 
                (minimum (Number 
                  (+ (get (get arr (- i 1)) j) 1)
                  (+ (get (get arr i) (- j 1)) 1)
                  (+ (get (get arr (- i 1)) (- j 1)) (not (= (get s (- j 1)) (get t (- i 1)))))))))
              (iterate-j (+ j 1)))))
            (iterate-j 1)
          (iterate-i (+ i 1)))))
        (iterate-i 0)
        (get (get arr (length t)) (length s))))))
  ; neighborhood
  (defun neighborhood array directions y x callback
      (reduce directions (lambda sum dir . . (do
          (defconstant
              dy (+ (car dir) y)
              dx (+ (car (cdr dir)) x))
          (+ sum (when (and (array-in-bounds-p array dy) (array-in-bounds-p (get array dy) dx)) (callback (get (get array dy) dx) dir))))) 0))
    ; greatest-common-divisor
    (defun greatest-common-divisor a b (do (loop defun gcd a b (if (= b 0) a (gcd b (mod a b)))) (gcd a b)))
    ; least-common-divisor
    (defun least-common-divisor a b (* a b (/ (greatest-common-divisor a b))))
    ; remainder
    (defun remainder n d (do (loop defun remain n d (if (< n d) n (remain (- n d) d))) (remain n d)))
    ; factorial
    (defun factorial n (if (<= n 0) 1 (* n (factorial (- n 1)))))
    ; fibonacci
    (defun fibonacci n (if (< n 2) n (+ (fibonacci (- n 1)) (fibonacci (- n 2)))))
    ; fibonacci-memoized
    (defun fibonacci-memoized n memo (if (< n 2) n
        (if (hash-table-has memo n) (hash-table-get memo n)
        (do
          (defconstant cache (+ (fibonacci-memoized (- n 1) memo) (fibonacci-memoized (- n 2) memo)))
          (hash-table-set memo n cache)
          cache))))
    ; is-prime
    (defun is-prime n (do 
        (loop defun iter i end (do 
            (defconstant it-is (not (= (mod n i) 0)))
            (if (and (<= i end) it-is) (iter (+ i 1) end) it-is)))
      (or (= n 2) (iter 2 (sqrt n)))))
  ; prime-factors
  (defun prime-factors n (do 
    (defvar a () f 2)
    (loop defun iterate (if (> n 1) (do 
      (if (= (mod n f) 0) 
        (do 
          (push a f)
          (setf n (* n (/ f))))
        (setf f (+ f 1)))
      (iterate)) a))
      (iterate)))
    ; chinese-remainder-theorem
    (defun chinese-remainder-theorem items
      (do 
        (defvar result (car (car items)))
          (reduce 
            (cdr items) 
            (lambda step item . . (do 
            (defconstant 
                id (car item)
                index (car (cdr item)))
            (loop defun rem time
              (unless (= (mod (+ time index) id) 0) 
                (rem (+ time step)) 
                time))
            (setf result (rem result))
            (* step id))) 
            result)
          result))
    ; euclid-inverse-mod
    (defun euclid-inverse-mod a m (do 
          (defvar 
              m0 m 
              x0 0 
              x1 1)
          (unless (= m 1) (do 
              ; Apply extended Euclid Algorithm
              (loop defun euclid a (if (> a 1) (do
              ; q is quotient
              (defvar 
                  q (floor (* a (/ m))) 
                  t m)
              ; m is remainder now, process
              ; same as euclid's algo
              (setf m (mod a m))
              (setf a t)
              (setf t x0)
              (setf x0 (- x1 (* q x0)))
              (setf x1 t)
              (euclid a))))
              (euclid a)
              ; Make x1 positive
              (when (< x1 0) (setf x1 (+ x1 m0)))
              x1))))
      ; join
      (defun join array delim (reduce array (lambda a x i . (if (> i 0) (concatenate a delim (type x String)) (type x String))) ""))
      ; repeat
      (defun repeat n x (map (Array n length) (lambda . . . x)))
      ; split-by-lines
      (defun split-by-lines string (regex-match string "[^\n]+"))
      ; split-by
      (defun split-by string delim (regex-match string (concatenate "[^" delim "]+")))
      ; trim
      (defun trim string (regex-replace string "^\s+|\s+$" ""))
      ; array-of-numbers
      (defun array-of-numbers array (map array (lambda x . . (type x Number))))
      ; concat
      (defun concat array1 array2 (do
        (loop defun iterate i bounds (do
        (when (< i (length array2)) (push array1 (get array2 i)))
        (if (< i bounds) 
          (iterate (+ i 1) bounds)
        array1
        )))
      (iterate 0 (- (length array2) 1))))
      ; merge
      (defun merge array1 array2 (do
        (loop defun iterate i bounds (do
        (push array1 (get array2 i))
        (if (< i bounds) 
          (iterate (+ i 1) bounds)
        array1
        )))
      (iterate 0 (- (length array2) 1))))
      ; range
      (defun range start end (do
        (defconstant array ())
        (loop defun iterate i bounds (do
          (push array (+ i start))
          (if (< i bounds) (iterate (+ i 1) bounds) array)))
        (iterate 0 (- end start))))
    ; sequance
      (defun sequance end start step (do
        (defconstant array ())
        (loop defun iterate i bounds (do
          (push array (+ i start))
          (if (< i bounds) (iterate (+ i step) bounds) array)))
        (iterate 0 (- end start))))
      ; arithmetic-progression
      (defun arithmetic-progression n lim (do
        (defconstant array ())
        (loop defun iterate i bounds (do
          (push array (+ i n))
          (if (< i bounds) (iterate (+ i n) bounds) array)))
        (iterate 0 (- lim n))))
      ; map
      (defun map array callback (do 
        (defconstant new-array ())
        (defvar i 0)
        (loop defun iterate i bounds (do
          (set new-array i (callback (get array i) i array))
          (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
        (iterate 0 (- (length array) 1))))
      ; for-each
      (defun for-each array callback (do
        (loop defun iterate i bounds (do
          (callback (get array i) i array)
          (if (< i bounds) (iterate (+ i 1) bounds) array)))
        (iterate 0 (- (length array) 1))))
  ; for-n
  (defun for-n N callback (do
    (loop defun iterate i (do 
        (defconstant res (callback i))
        (if (< i N) (iterate (+ i 1)) res))) 
        (iterate 0)))
  ; for-range
  (defun for-range start end callback (do
    (loop defun iterate i (do 
        (defconstant res (callback i))
        (if (< i end) (iterate (+ i 1)) res))) 
        (iterate start)))
  ; count-of
  (defun count-of array callback (do
    (defvar amount 0)
    (loop defun iterate i bounds (do
      (defconstant current (get array i))
      (when (callback current i array) (setf amount (+ amount 1)))
      (if (< i bounds) (iterate (+ i 1) bounds) amount)))
    (iterate 0 (- (length array) 1))))
  ; partition 
  (defun partition array n (reduce array (lambda a x i . (do 
        (if (mod i n) (push (get a -1) x) (push a (Array x))) a)) 
        ()))
  ; remove
  (defun remove array callback (do
    (defconstant new-array ())
    (loop defun iterate i bounds (do
      (defconstant current (get array i))
      (when (callback current i array) 
        (push new-array current))
      (if (< i bounds) (iterate (+ i 1) bounds) new-array)))
    (iterate 0 (- (length array) 1))))
  ; every
  (defun every array callback (do
      (defvar bol 1)
      (loop defun iterate i bounds (do
        (defconstant res (callback (get array i) i array))
        (boole bol (type res Boolean))
        (if (and res (< i bounds)) (iterate (+ i 1) bounds) bol)))
      (iterate 0 (- (length array) 1))))
  ; some
  (defun some array callback (do
      (defvar bol 1)
      (loop defun iterate i bounds (do
        (defconstant res (callback (get array i) i array))
        (boole bol (type res Boolean))
        (if (and (not res) (< i bounds)) (iterate (+ i 1) bounds) bol)))
      (iterate 0 (- (length array) 1))))
  ; reduce
  (defun reduce array callback initial (do
    (loop defun iterate i bounds (do
      (setf initial (callback initial (get array i) i array))
      (if (< i bounds) (iterate (+ i 1) bounds) initial)))
    (iterate 0 (- (length array) 1))))
    ; accumulate
    (defun accumulate array callback (do
      (defvar initial (get array 0))
      (loop defun iterate i bounds (do
        (setf initial (callback initial (get array i) i array))
        (if (< i bounds) (iterate (+ i 1) bounds) initial)))
      (iterate 0 (- (length array) 1))))
    ; sum-array
    (defun sum-array array (reduce array (lambda a b . . (+ a b)) 0))
    ; product-array
    (defun product-array array (reduce array (lambda a b . . (* a b)) 1))
    ; deep-flat
    (defun deep-flat arr (do 
      (defconstant new-array ()) 
      (defconstant flatten (lambda item 
        (if (and (Arrayp item) (length item)) 
              (for-each item (lambda x . . (flatten x))) 
              (otherwise (Arrayp item) (push new-array item)))))
      (flatten arr) 
      new-array))
    ; find
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
    (defun index-of array target (do
      (defvar idx -1 has-found 0)
      (loop defun iterate i bounds (do
        (defconstant current (get array i))
        (boole has-found (and (atom current) (= target current)))
        (if (and (not has-found) (< i bounds))
          (iterate (+ i 1) bounds) 
          (setf idx i))))
          (iterate 0 (- (length array) 1))
          (if has-found idx -1)))
      ; last-index-of
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
      (defun quick-sort arr (do
        (if (<= (length arr) 1) arr
        (do
          (defconstant 
            pivot (get arr 0) 
            left-arr () 
            right-arr ())
        (loop defun iterate i bounds (do
          (defconstant current (get arr i))
          (if (< current pivot) 
              (push left-arr current)
              (push right-arr current))
          (when (< i bounds) (iterate (+ i 1) bounds))))
          (iterate 1 (- (length arr) 1))
      (go 
        left-arr (quick-sort) 
        (push pivot) 
        (concat (quick-sort right-arr)))))))
      ; reverse 
      (defun reverse array (do
        (defconstant 
          len (length array)
          reversed (Array len length)
          offset (- len 1))
        (loop defun iterate i bounds (do
          (set reversed (- offset i) (get array i))
          (if (< i bounds) (iterate (+ i 1) bounds) reversed)))
        (iterate 0 offset)))
      ; binary-search
      (defun binary-search 
              array target (do
        (loop defun search 
              arr target start end (do
          (when (<= start end) (do 
              (defconstant 
                index (floor (* (+ start end) 0.5))
                current (get arr index))
              (if (= target current) target
                (if (> current target) 
                  (search arr target start (- index 1))
                  (search arr target (+ index 1) end))))))) 
        (search array target 0 (length array))))
      ; hash-index
      (defun hash-index 
        table key 
          (do
            (defconstant 
              prime-num 31
              key-arr (type (type key String) Array))
            (defvar total 0)
            (loop defun find-hash-index i bounds (do 
              (defconstant 
                letter (get key-arr i) 
                value (- (char-code letter 0) 96))
              (setf total (euclidean-mod (+ (* total prime-num) value) (length table)))
              (if (< i bounds) (find-hash-index (+ i 1) bounds) total)))
            (find-hash-index 0 (min (- (length key-arr) 1) 100))))

      ; (Hash Table)
      ; (go 
      ;   (hash-table-make (Array 
      ;     (Array "name" "Anthony") 
      ;     (Array "age" 32) 
      ;     (Array "skills" 
      ;       (Array "Animation" "Programming"))))
      ;   (log)
      ; )
        ; hash-table-set
      (defun hash-table-set 
        table key value 
          (do
            (defconstant idx (hash-index table key))
            (otherwise (array-in-bounds-p table idx) (set table idx ()))
            (defconstant 
              current (get table idx)
              len (length current)
              index (if len (find-index current (lambda x . . (= (get x 0) key))) -1)
              entry (Array key value))
            (if (= index -1)
              (push current entry)
              (set current index entry)
            )
            table))
      ; hash table_has 
      (defun hash-table-has table key 
        (and (array-in-bounds-p table (defconstant idx (hash-index table key))) (and (length (defconstant current (get table idx))) (>= (index-of (car current) key) 0))))
      ; hash-table-get
      (defun hash-table-get
        table key 
          (do
            (defconstant idx (hash-index table key))
            (if (array-in-bounds-p table idx) 
              (do
                (defconstant current (get table idx))
                (go current
                  (find (lambda x . . (= key 
                          (go x (get 0)))))
                  (get 1))))))
      ; hash-table
      (defun hash-table 
        size 
          (map (Array size length) (lambda . . . ())))
      ; hash-table-make
      (defun hash-table-make 
        items 
          (do
            (defconstant 
              len (- (length items) 1)
              table (hash-table (* len len)))
            (loop defun add i (do
              (defconstant item (get items i))
              (hash-table-set table (get item 0) (get item 1))
            (if (< i len) (add (+ i 1)) table)))
            (add 0)))
        ; hash-set-set
      (defun hash-set-set 
        table key 
          (do
            (defconstant idx (hash-index table key))
            (otherwise (array-in-bounds-p table idx) (set table idx ()))
            (defconstant 
              current (get table idx)
              len (length current)
              index (if len (find-index current (lambda x . . (= x key))) -1)
              entry key)
            (if (= index -1)
              (push current entry)
              (set current index entry)
            )
            table))
      ; hash table_has 
      (defun hash-set-has table key 
        (and (array-in-bounds-p table (defconstant idx (hash-index table key))) (and (length (defconstant current (get table idx))) (>= (index-of current key) 0))))
      ; hash-set-get
      (defun hash-set-get table key (do
            (defconstant idx (hash-index table key))
            (if (array-in-bounds-p table idx) (do
                (defconstant current (get table idx))
                (go current
                  (find (lambda x . . (= key x))))))))
      ; hash-set
      (defun hash-set size (map (Array size length) (lambda . . . ())))
      ; hash-set-make
      (defun hash-set-make items (do
          (defconstant 
            len (- (length items) 1)
            table (hash-set (* len len)))
          (loop defun add i (do
            (defconstant item (get items i))
            (hash-set-set table item)
          (if (< i len) (add (+ i 1)) table)))
          (add 0)))
    ; (/ Hash Set)

      ; (Binary Tree)
      ; (go 
      ; (binary-tree-node 1)
      ; (binary-tree-set-left (go 
      ;                         (binary-tree-node 2) 
      ;                         (binary-tree-set-left 
      ;                           (go (binary-tree-node 4) 
      ;                               (binary-tree-set-right 
      ;                               (binary-tree-node 5))))))
      ; (binary-tree-set-right (binary-tree-node 3))
      ; (binary-tree-get-left)
      ; (binary-tree-get-left)
      ; (binary-tree-get-right))
      ; binary-tree-node
      (defun binary-tree-node value 
        (Array 
          (Array "value" value)
          (Array "left"  ())
          (Array "right" ())))
      ; binary-tree-get-left
      (defun binary-tree-get-left node (get node 1))
      ; binary-tree-get-right
      (defun binary-tree-get-right node (get node 2))
      ; binary-tree-set-left
      (defun binary-tree-set-left tree node (set tree 1 node))
      ; binary-tree-set-right
      (defun binary-tree-set-right tree node (set tree 2 node)) 
      ; binary-tree-get-value
      (defun binary-tree-get-value node (get node 0))  
      ; (/ Binary Tree)
      ; left-pad
      (defun left-pad str n ch (do 
        (setf n (- n (length str)))
        (loop defun pad i str (if (< i n) (pad (+ i 1) (setf str (concatenate ch str))) str))
        (pad 0 str)))
        ; left-pad
      (defun right-pad str n ch (do 
        (setf n (- n (length str)))
        (loop defun pad i str (if (< i n) (pad (+ i 1) (setf str (concatenate str ch))) str))
        (pad 0 str)))
      ; occurances_count
      (defun character-occurances-in-string string letter (do
        (defvar 
          array (type string Array)
          bitmask 0
          zero (char-code "a" 0)
          count 0
          has-at-least-one 0)
        (loop defun iterate i bounds  (do
            (defconstant 
              ch (get array i)
              code (- (char-code ch 0) zero)
              mask (<< 1 code))
            (if (and (when (= ch letter) (boole has-at-least-one 1))
                (not (= (& bitmask mask) 0))) 
                (setf count (+ count 1))
                (setf bitmask (| bitmask mask)))
            (if (< i bounds) (iterate (+ i 1) bounds) 
            (+ count has-at-least-one))))
            (iterate 0 (- (length array) 1))))
    ;  to-upper-case
    (defun to-upper-case str (do
     (defconstant 
            arr () 
            n (length str))
      (loop defun iter i (if (< i n) (do 
        (defconstant current-char (char-code str i))
        (setq arr i 
          (if (and (>= current-char 97) (<= current-char 122))
            (- current-char 32)
            current-char
        ))
        (iter (+ i 1))) 
        (make-string arr)))
        (iter 0)))
    ;  to-lower-case
    (defun to-lower-case str (do
      (defconstant 
            arr () 
            n (length str))
      (loop defun iter i (if (< i n) (do 
        (defconstant current-char (char-code str i))
        (setq arr i 
          (if (and (>= current-char 65) (<= current-char 90))
            (+ current-char 32)
            current-char
        ))
        (iter (+ i 1))) 
        (make-string arr)))
        (iter 0)))
    ; split-by-n-lines
    (defun split-by-n-lines string n (go string (regex-replace (concatenate "(\n){" (type n String) "}") "௮") (regex-match "[^௮]+") (map (lambda x . . (regex-match x "[^\n]+")))))
    ; split
    (defun split string separator (do 
        (defconstant 
          sepArr (type separator Array)
          array (type string Array)
          skip (length sepArr))
        (defvar cursor "")
        (loop defun iterate result i bounds
          (if (< (if (every sepArr (lambda y j . (= (get array (+ i j)) y)))
                (do 
                  (setf i (+ i skip -1))
                  (push result cursor)
                  (setf cursor "")
                  i)
                (do (setf cursor (concatenate cursor (get array i))) i)) bounds) 
                    (iterate result (+ i 1) bounds) result))
        (push (iterate () 0 (- (length array) 1)) cursor)))
      ; slice 
      (defun slice array start end (do 
        (defconstant bounds (- end start) out (Array bounds length))
        (loop defun iterate i 
          (if (< i bounds) 
              (do 
                (set out i (get array (+ start i))) 
                (iterate (+ i 1)))
              out))
              (iterate 0)))
      ; slice-if-index
      (defun slice-if-index array callback (reduce array (lambda a b i . (if (callback i) (push a b) a)) ()))
      ; slice-if
      (defun slice-if array callback (reduce array (lambda a b i . (if (callback b i) (push a b) a)) ()))
      ; window
      (defun window inp n (go inp 
        (reduce (lambda acc current i all 
          (if (>= i n) 
            (push acc (slice all (- i n) i)) acc)) ())))
      ; cartesian-product
      (defun cartesian-product a b (reduce a (lambda p x . . (merge p (map b (lambda y . . (Array x y))))) ()))
      ; equal 
      (defun equal a b 
      (or (and (atom a) (atom b) (= a b)) 
      (and (Arrayp a) 
            (= (length a) (length b)) 
              (not (some a (lambda . i . (not (equal (get a i) (get b i)))))))))
      ; adjacent-difference
      (defun adjacent-difference array callback (do 
        (defconstant len (length array))
        (unless (= len 1) 
          (do (defconstant result (Number (car array)))
          (loop defun iterate i (if (< i len) (do 
          (setq result i (callback (get array (- i 1)) (get array i)))
          (iterate (+ i 1))) result))
          (iterate 1)) array)))
    ; exports
    (Array 
      (Array "max" max)
      (Array "min" min) 
      (Array "maximum" maximum)
      (Array "minimum" minimum) 
      (Array "is-odd" is-odd) 
      (Array "is-even" is-even) 
      (Array "push" push)
      (Array "pop" pop)
      (Array "array-in-bounds-p" array-in-bounds-p)  
      (Array "abs" abs)
      (Array "floor" floor)
      (Array "round" round)
      (Array "euclidean-mod" euclidean-mod)
      (Array "euclidean-div" euclidean-div)
      (Array "join" join)
      (Array "trim" trim)
      (Array "split-by-lines" split-by-lines)
      (Array "split-by" split-by)
      (Array "split-by-n-lines" split-by-n-lines)
      (Array "split" split)
      (Array "array-of-numbers" array-of-numbers)
      (Array "concat" concat)
      (Array "merge" merge)
      (Array "range" range)
      (Array "sequance" sequance)
      (Array "arithmetic-progression" arithmetic-progression)
      (Array "map" map)
      (Array "for-each" for-each)
      (Array "for-n" for-n)
      (Array "for-range" for-range)
      (Array "remove" remove)
      (Array "reduce" reduce)
      (Array "sum-array" sum-array)
      (Array "product-array" product-array)
      (Array "deep-flat" deep-flat)
      (Array "find" find)
      (Array "find-index" find-index)
      (Array "quick-sort" quick-sort)
      (Array "reverse" reverse)
      (Array "binary-search" binary-search)
      (Array "hash-table-set" hash-table-set)
      (Array "hash-table-has" hash-table-has)
      (Array "hash-table-get" hash-table-get)
      (Array "hash-table" hash-table)
      (Array "hash-table-make" hash-table-make)
      (Array "hash-set-set" hash-set-set)
      (Array "hash-set-has" hash-set-has)
      (Array "hash-set-get" hash-set-get)
      (Array "hash-set" hash-set)
      (Array "hash-set-make" hash-set-make)
      (Array "binary-tree-node" binary-tree-node)
      (Array "binary-tree-get-left" binary-tree-get-left)
      (Array "binary-tree-get-right" binary-tree-get-right)
      (Array "binary-tree-set-right" binary-tree-set-right)
      (Array "binary-tree-set-left" binary-tree-set-left)
      (Array "binary-tree-get-value" binary-tree-get-value)
      (Array "character-occurances-in-string" character-occurances-in-string)
      (Array "greatest-common-divisor" greatest-common-divisor)
      (Array "least-common-divisor" least-common-divisor)
      (Array "remainder" remainder)
      (Array "factorial" factorial)
      (Array "fibonacci" fibonacci)
      (Array "fibonacci-memoized" fibonacci-memoized)
      (Array "every" every)
      (Array "some" some)
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
      (Array "equal" equal)
      (Array "can-sum" can-sum)
      (Array "how-can-sum" how-can-sum)
      (Array "adjacent-difference" adjacent-difference)
      (Array "neighborhood" neighborhood)
      (Array "clamp" clamp)
      (Array "manhattan-distance" manhattan-distance)
      (Array "manhattan-distance" euclidean-distance)
      (Array "normalize" normalize)
      (Array "linear-interpolation" linear-interpolation)
      (Array "power" power)
      (Array "radians" radians)
      (Array "sin" sin)
      (Array "cos" cos)
      (Array "repeat" repeat)
      (Array "sign" sign)
      (Array "square" square)
      (Array "average" average)
      (Array "sqrt" sqrt)
      (Array "is-prime" is-prime)
      (Array "euclid-inverse-mod" euclid-inverse-mod)
      (Array "cartesian-product" cartesian-product)
      (Array "chinese-remainder-theorem" chinese-remainder-theorem)
      (Array "gauss-sum-sequance" gauss-sum-sequance)
      (Array "gauss-sum" gauss-sum)
      (Array "prime-factors" prime-factors)
      (Array "levenshtein-distance" levenshtein-distance)
      (Array "binomial-coefficient" binomial-coefficient)
      (Array "window" window)
      (Array "max-bit" max-bit)
      (Array "min-bit" min-bit)
      (Array "clamp-bit" clamp-bit)
      (Array "is-bit-power-of-two" is-bit-power-of-two)
      (Array "average-bit" average-bit)
      (Array "toggle-bit" toggle-bit)
      (Array "is-odd-bit" is-odd-bit)
      (Array "is-same-sign-bit" is-same-sign-bit)
      (Array "modulo-bit" modulo-bit)
      (Array "set-bit" set-bit)
      (Array "clear-bit" clear-bit)
      (Array "power-of-two-bit" power-of-two-bit)
      (Array "count-number-of-ones-bit" count-number-of-ones-bit)
      (Array "check-n-is-one-bit" check-n-is-one-bit)
      (Array "possible-subsets-bit" possible-subsets-bit)
      (Array "largest-power" largest-power)
      (Array "left-pad" left-pad)
      (Array "right-pad" right-pad)
      (Array "to-upper-case" to-upper-case)
      (Array "to-lower-case" to-lower-case)
   )
))
; (/ std lib)