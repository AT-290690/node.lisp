(import std "push" "binary_tree_node" "binary_tree_set_right" "binary_tree_set_left" "binary_tree_get_right" "binary_tree_get_left")
(let tree (do 
    (binary_tree_node 1)
    (binary_tree_set_left 
          (do 
            (binary_tree_node 2) 
            (binary_tree_set_left 
              (do (binary_tree_node 4) 
                  (binary_tree_set_right 
                  (binary_tree_node 5))))))
    (binary_tree_set_right (binary_tree_node 3))
    (binary_tree_get_left)
    (binary_tree_get_left)
    (binary_tree_get_right)))
(log tree)