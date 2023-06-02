(function binary_tree_node 
        value (Array 
                (Array "value" value)
                (Array "left"  (Array 0))
                (Array "right" (Array 0))))
(function binary_tree_get_left 
                node (get node 1))
(function binary_tree_get_right 
                node (get node 2))
(function binary_tree_set_left 
                tree node (set tree 1 node))
(function binary_tree_set_right 
                tree node (set tree 2 node)) 
(function binary_tree_get_value
                node (get node 0))
(do 
(binary_tree_node 1)
(binary_tree_set_left (do 
                        (binary_tree_node 2) 
                        (binary_tree_set_left 
                          (do (binary_tree_node 4) 
                              (binary_tree_set_right 
                              (binary_tree_node 5))))))
(binary_tree_set_right (binary_tree_node 3))
(binary_tree_get_left)
(binary_tree_get_left)
(binary_tree_get_right)
(log))
