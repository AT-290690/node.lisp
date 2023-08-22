(import dom "button" "paragraph" "div" "image" "input" "pixels")
(import std "to-upper-case")
(defconstant *COLORS* (Array "#000" "#FFF" "crimson"))
(defconstant body (:set-style (:body) (Array (Array "backgroundColor" (get *COLORS* 1)))))
(defun todo value parent (do 
  (defconstant t (go 
  (div (Array 
    (go 
      (paragraph value) 
      (:set-style (Array (Array "color" (get *COLORS* 0)))))
    (go 
      (button "x")
      (:set-style 
        (Array 
          (Array "border" "none") 
          (Array "cursor" "pointer")
          (Array "width" "fit-content")
          (Array "height" "fit-content") 
          (Array "color" (get *COLORS* 2))
          (Array "backgroundColor" (get *COLORS* 1)))) 
      (:on-click (lambda but . (:remove-from t parent))))))
  (:set-style 
    (Array (Array "display" "flex") 
    (Array "justify-content" "left") 
    (Array "align-items" "center")))  
  (:append-to parent)))))
(go 
  (div 
    (Array
      (go (div (Array (:set-attribute (image "../../logo.svg") "width" (pixels 100)) (:set-style (paragraph "TODO APP") (Array (Array "margin-left" (pixels 10)))))) (:set-style 
    (Array 
      (Array "display" "flex") 
      (Array "color" (get *COLORS* 0))
      (Array "justify-content" "left") 
      (Array "align-items" "center"))))
      (:element "p")
      (defconstant inp (input))
        (go 
          (button "ADD TODO")
          (:set-style (Array (Array "cursor" "pointer")))
          (:on-click (lambda but . (and (:get-value inp) (todo (to-upper-case (:get-value inp)) (:parent but)) (:set-value inp "")))))))
      (:set-style (Array (Array "padding-left" (pixels 15))))
      (:append-to body))