(let sample "dasdasdas
dasdasd
asdasdasd
asdasda
sadasdasd")

(function split_by string delim (regex_match string (concatenate "[^" delim "]+")))
(log (split_by sample "-"))