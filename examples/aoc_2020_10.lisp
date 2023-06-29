(import std "split-by" "array-of-numbers" "reduce" "max" "quick-sort" "map" "concat" "push" "adjacent-difference" "count")
(let sample "16
10
15
5
1
11
7
19
6
12
4")

(let sample2 "28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3")

(let *input* sample)
(let *parsed-input* (do *input* (split-by "\n") (array-of-numbers)))
(let diffs (do *parsed-input* 
   (quick-sort) 
   (adjacent-difference (lambda a b (- b a)))))
  (let diffs2 (do *parsed-input* 
   (quick-sort) 
   (adjacent-difference (lambda a b (- b a)))))
  (Array (* 
        (do 
          diffs 
          (count (lambda x _ _ (= x 1))))
          (+ (do 
              diffs
              (count (lambda x _ _ (= x 3)))) 1)))