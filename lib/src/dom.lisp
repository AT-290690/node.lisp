; (dom lib)
(defun dom (do
  ; modules
  ; button
  (defun button text (:set-text-content (:element "button") text))
  ; paragraph
  (defun paragraph text (:set-text-content (:element "p") text))
  ; span
  (defun span text (:set-text-content (:element "span") text))
  ; preformatted
  (defun preformatted text (:set-text-content (:element "pre") text))
  ; text-area
  (defun text-area rows cols (go (:element "textarea") (:set-attribute "rows" rows) (:set-attribute "cols" cols)))
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
      (Array "span" span)
      (Array "preformatted" preformatted)
      (Array "div" div)
      (Array "image" image)
      (Array "input" input)
      (Array "text-area" text-area)
      (Array "pixels" pixels)
      (Array "percent" percent)
   )
))
; (/ dom lib)