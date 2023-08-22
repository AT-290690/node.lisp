; (dom lib)
(defun dom (do
  ; modules
  ; button
  (defun button text (:set-text-content (:element "button") text))
  ; p
  (defun paragraph text (:set-text-content (:element "p") text))
  ; img
  (defun image src (:set-attribute (:element "img") "src" src))
  ; input
  (defun input (:element "input"))
  ; div
  (defun div children (do 
    (defconstant parent (:element "div"))
    (loop defun iterate i bounds (do
      (defconstant current (get children i))
      (:append parent current)
      (if (< i bounds) (iterate (+ i 1) bounds) parent)))
      (iterate 0 (- (length children) 1))))
; pixels
(defun pixels value (concatenate (type value String) "px"))
; percent
(defun percent value (concatenate (type value String) "%"))
    (Array 
      (Array "button" button)
      (Array "paragraph" paragraph)
      (Array "div" div)
      (Array "image" image)
      (Array "input" input)
      (Array "pixels" pixels)
      (Array "percent" percent)
   )
))
; (/ dom lib)