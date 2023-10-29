export default [[{"t":"f","v":"defun"},{"t":"w","v":"str"},[{"t":"f","v":"do"},[{"t":"f","v":"deftype"},{"t":"w","v":"join"},[{"t":"f","v":"Lambda"},[{"t":"f","v":"Or"},[{"t":"f","v":"Array"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]]]],[{"t":"f","v":"defun"},{"t":"w","v":"join"},{"t":"w","v":"array"},{"t":"w","v":"delim"},[{"t":"f","v":"reduce"},{"t":"w","v":"array"},[{"t":"f","v":"lambda"},{"t":"w","v":"a"},{"t":"w","v":"x"},{"t":"w","v":"i"},{"t":"w","v":"."},[{"t":"f","v":"if"},[{"t":"f","v":">"},{"t":"w","v":"i"},{"t":"a","v":0}],[{"t":"f","v":"concatenate"},{"t":"w","v":"a"},{"t":"w","v":"delim"},[{"t":"f","v":"type"},{"t":"w","v":"x"},{"t":"w","v":"String"}]],[{"t":"f","v":"type"},{"t":"w","v":"x"},{"t":"w","v":"String"}]]],{"t":"a","v":""}]],[{"t":"f","v":"deftype"},{"t":"w","v":"trim"},[{"t":"f","v":"Lambda"},[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]]]],[{"t":"f","v":"defun"},{"t":"w","v":"trim"},{"t":"w","v":"string"},[{"t":"f","v":"regex-replace"},{"t":"w","v":"string"},{"t":"a","v":"^ +| +$"},{"t":"a","v":""}]],[{"t":"f","v":"deftype"},{"t":"w","v":"left-pad"},[{"t":"f","v":"Lambda"},[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"Number"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]]]],[{"t":"f","v":"defun"},{"t":"w","v":"left-pad"},{"t":"w","v":"str"},{"t":"w","v":"n"},{"t":"w","v":"ch"},[{"t":"f","v":"do"},[{"t":"f","v":"setf"},{"t":"w","v":"n"},[{"t":"f","v":"-"},{"t":"w","v":"n"},[{"t":"f","v":"length"},{"t":"w","v":"str"}]]],[{"t":"f","v":"loop"},{"t":"w","v":"defun"},{"t":"w","v":"pad"},{"t":"w","v":"i"},{"t":"w","v":"str"},[{"t":"f","v":"if"},[{"t":"f","v":"<"},{"t":"w","v":"i"},{"t":"w","v":"n"}],[{"t":"f","v":"pad"},[{"t":"f","v":"+"},{"t":"w","v":"i"},{"t":"a","v":1}],[{"t":"f","v":"setf"},{"t":"w","v":"str"},[{"t":"f","v":"concatenate"},{"t":"w","v":"ch"},{"t":"w","v":"str"}]]],{"t":"w","v":"str"}]],[{"t":"f","v":"pad"},{"t":"a","v":0},{"t":"w","v":"str"}]]],[{"t":"f","v":"deftype"},{"t":"w","v":"right-pad"},[{"t":"f","v":"Lambda"},[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"Number"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]]]],[{"t":"f","v":"defun"},{"t":"w","v":"right-pad"},{"t":"w","v":"str"},{"t":"w","v":"n"},{"t":"w","v":"ch"},[{"t":"f","v":"do"},[{"t":"f","v":"setf"},{"t":"w","v":"n"},[{"t":"f","v":"-"},{"t":"w","v":"n"},[{"t":"f","v":"length"},{"t":"w","v":"str"}]]],[{"t":"f","v":"loop"},{"t":"w","v":"defun"},{"t":"w","v":"pad"},{"t":"w","v":"i"},{"t":"w","v":"str"},[{"t":"f","v":"if"},[{"t":"f","v":"<"},{"t":"w","v":"i"},{"t":"w","v":"n"}],[{"t":"f","v":"pad"},[{"t":"f","v":"+"},{"t":"w","v":"i"},{"t":"a","v":1}],[{"t":"f","v":"setf"},{"t":"w","v":"str"},[{"t":"f","v":"concatenate"},{"t":"w","v":"str"},{"t":"w","v":"ch"}]]],{"t":"w","v":"str"}]],[{"t":"f","v":"pad"},{"t":"a","v":0},{"t":"w","v":"str"}]]],[{"t":"f","v":"deftype"},{"t":"w","v":"character-occurances-in-string"},[{"t":"f","v":"Lambda"},[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"Number"}]]]],[{"t":"f","v":"defun"},{"t":"w","v":"character-occurances-in-string"},{"t":"w","v":"string"},{"t":"w","v":"letter"},[{"t":"f","v":"do"},[{"t":"f","v":"defvar"},{"t":"w","v":"array"},[{"t":"f","v":"type"},{"t":"w","v":"string"},{"t":"w","v":"Array"}],{"t":"w","v":"bitmask"},{"t":"a","v":0},{"t":"w","v":"zero"},[{"t":"f","v":"char-code"},{"t":"a","v":"a"},{"t":"a","v":0}],{"t":"w","v":"count"},{"t":"a","v":0},{"t":"w","v":"has-at-least-one"},{"t":"a","v":0}],[{"t":"f","v":"loop"},{"t":"w","v":"defun"},{"t":"w","v":"iterate"},{"t":"w","v":"i"},{"t":"w","v":"bounds"},[{"t":"f","v":"do"},[{"t":"f","v":"defconstant"},{"t":"w","v":"ch"},[{"t":"f","v":"get"},{"t":"w","v":"array"},{"t":"w","v":"i"}],{"t":"w","v":"code"},[{"t":"f","v":"-"},[{"t":"f","v":"char-code"},{"t":"w","v":"ch"},{"t":"a","v":0}],{"t":"w","v":"zero"}],{"t":"w","v":"mask"},[{"t":"f","v":"<<"},{"t":"a","v":1},{"t":"w","v":"code"}]],[{"t":"f","v":"if"},[{"t":"f","v":"and"},[{"t":"f","v":"when"},[{"t":"f","v":"="},{"t":"w","v":"ch"},{"t":"w","v":"letter"}],[{"t":"f","v":"boole"},{"t":"w","v":"has-at-least-one"},{"t":"a","v":1}]],[{"t":"f","v":"not"},[{"t":"f","v":"="},[{"t":"f","v":"&"},{"t":"w","v":"bitmask"},{"t":"w","v":"mask"}],{"t":"a","v":0}]]],[{"t":"f","v":"setf"},{"t":"w","v":"count"},[{"t":"f","v":"+"},{"t":"w","v":"count"},{"t":"a","v":1}]],[{"t":"f","v":"setf"},{"t":"w","v":"bitmask"},[{"t":"f","v":"|"},{"t":"w","v":"bitmask"},{"t":"w","v":"mask"}]]],[{"t":"f","v":"if"},[{"t":"f","v":"<"},{"t":"w","v":"i"},{"t":"w","v":"bounds"}],[{"t":"f","v":"iterate"},[{"t":"f","v":"+"},{"t":"w","v":"i"},{"t":"a","v":1}],{"t":"w","v":"bounds"}],[{"t":"f","v":"+"},{"t":"w","v":"count"},{"t":"w","v":"has-at-least-one"}]]]],[{"t":"f","v":"iterate"},{"t":"a","v":0},[{"t":"f","v":"-"},[{"t":"f","v":"length"},{"t":"w","v":"array"}],{"t":"a","v":1}]]]],[{"t":"f","v":"deftype"},{"t":"w","v":"to-upper-case"},[{"t":"f","v":"Lambda"},[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]]]],[{"t":"f","v":"defun"},{"t":"w","v":"to-upper-case"},{"t":"w","v":"str"},[{"t":"f","v":"do"},[{"t":"f","v":"defconstant"},{"t":"w","v":"arr"},[{"t":"f","v":"Array"}],{"t":"w","v":"n"},[{"t":"f","v":"length"},{"t":"w","v":"str"}]],[{"t":"f","v":"loop"},{"t":"w","v":"defun"},{"t":"w","v":"iter"},{"t":"w","v":"i"},[{"t":"f","v":"if"},[{"t":"f","v":"<"},{"t":"w","v":"i"},{"t":"w","v":"n"}],[{"t":"f","v":"do"},[{"t":"f","v":"defconstant"},{"t":"w","v":"current-char"},[{"t":"f","v":"char-code"},{"t":"w","v":"str"},{"t":"w","v":"i"}]],[{"t":"f","v":"set"},{"t":"w","v":"arr"},{"t":"w","v":"i"},[{"t":"f","v":"if"},[{"t":"f","v":"and"},[{"t":"f","v":">="},{"t":"w","v":"current-char"},{"t":"a","v":97}],[{"t":"f","v":"<="},{"t":"w","v":"current-char"},{"t":"a","v":122}]],[{"t":"f","v":"-"},{"t":"w","v":"current-char"},{"t":"a","v":32}],{"t":"w","v":"current-char"}]],[{"t":"f","v":"iter"},[{"t":"f","v":"+"},{"t":"w","v":"i"},{"t":"a","v":1}]]],[{"t":"f","v":"make-string"},{"t":"w","v":"arr"}]]],[{"t":"f","v":"iter"},{"t":"a","v":0}]]],[{"t":"f","v":"deftype"},{"t":"w","v":"to-lower-case"},[{"t":"f","v":"Lambda"},[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]]]],[{"t":"f","v":"defun"},{"t":"w","v":"to-lower-case"},{"t":"w","v":"str"},[{"t":"f","v":"do"},[{"t":"f","v":"defconstant"},{"t":"w","v":"arr"},[{"t":"f","v":"Array"}],{"t":"w","v":"n"},[{"t":"f","v":"length"},{"t":"w","v":"str"}]],[{"t":"f","v":"loop"},{"t":"w","v":"defun"},{"t":"w","v":"iter"},{"t":"w","v":"i"},[{"t":"f","v":"if"},[{"t":"f","v":"<"},{"t":"w","v":"i"},{"t":"w","v":"n"}],[{"t":"f","v":"do"},[{"t":"f","v":"defconstant"},{"t":"w","v":"current-char"},[{"t":"f","v":"char-code"},{"t":"w","v":"str"},{"t":"w","v":"i"}]],[{"t":"f","v":"set"},{"t":"w","v":"arr"},{"t":"w","v":"i"},[{"t":"f","v":"if"},[{"t":"f","v":"and"},[{"t":"f","v":">="},{"t":"w","v":"current-char"},{"t":"a","v":65}],[{"t":"f","v":"<="},{"t":"w","v":"current-char"},{"t":"a","v":90}]],[{"t":"f","v":"+"},{"t":"w","v":"current-char"},{"t":"a","v":32}],{"t":"w","v":"current-char"}]],[{"t":"f","v":"iter"},[{"t":"f","v":"+"},{"t":"w","v":"i"},{"t":"a","v":1}]]],[{"t":"f","v":"make-string"},{"t":"w","v":"arr"}]]],[{"t":"f","v":"iter"},{"t":"a","v":0}]]],[{"t":"f","v":"deftype"},{"t":"w","v":"split-by-n-lines"},[{"t":"f","v":"Lambda"},[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"Number"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"Array"},[{"t":"f","v":"Array"},[{"t":"f","v":"String"}]]]]]],[{"t":"f","v":"defun"},{"t":"w","v":"split-by-n-lines"},{"t":"w","v":"string"},{"t":"w","v":"n"},[{"t":"f","v":"go"},{"t":"w","v":"string"},[{"t":"f","v":"regex-replace"},[{"t":"f","v":"concatenate"},{"t":"a","v":"(\n){"},[{"t":"f","v":"type"},{"t":"w","v":"n"},{"t":"w","v":"String"}],{"t":"a","v":"}"}],{"t":"a","v":"௮"}],[{"t":"f","v":"regex-match"},{"t":"a","v":"[^௮]+"}],[{"t":"f","v":"map"},[{"t":"f","v":"lambda"},{"t":"w","v":"x"},{"t":"w","v":"."},{"t":"w","v":"."},[{"t":"f","v":"regex-match"},{"t":"w","v":"x"},{"t":"a","v":"[^\n]+"}]]]]],[{"t":"f","v":"deftype"},{"t":"w","v":"split"},[{"t":"f","v":"Lambda"},[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"Array"},[{"t":"f","v":"String"}]]]]],[{"t":"f","v":"defun"},{"t":"w","v":"split"},{"t":"w","v":"string"},{"t":"w","v":"separator"},[{"t":"f","v":"do"},[{"t":"f","v":"defconstant"},{"t":"w","v":"sep-arr"},[{"t":"f","v":"type"},{"t":"w","v":"separator"},{"t":"w","v":"Array"}],{"t":"w","v":"array"},[{"t":"f","v":"type"},{"t":"w","v":"string"},{"t":"w","v":"Array"}],{"t":"w","v":"skip"},[{"t":"f","v":"length"},{"t":"w","v":"sep-arr"}]],[{"t":"f","v":"defvar"},{"t":"w","v":"cursor"},{"t":"a","v":""}],[{"t":"f","v":"loop"},{"t":"w","v":"defun"},{"t":"w","v":"iterate"},{"t":"w","v":"result"},{"t":"w","v":"i"},{"t":"w","v":"bounds"},[{"t":"f","v":"if"},[{"t":"f","v":"<"},[{"t":"f","v":"if"},[{"t":"f","v":"every?"},{"t":"w","v":"sep-arr"},[{"t":"f","v":"lambda"},{"t":"w","v":"y"},{"t":"w","v":"j"},{"t":"w","v":"."},[{"t":"f","v":"or"},[{"t":"f","v":"<="},[{"t":"f","v":"length"},{"t":"w","v":"array"}],[{"t":"f","v":"+"},{"t":"w","v":"i"},{"t":"w","v":"j"}]],[{"t":"f","v":"="},[{"t":"f","v":"get"},{"t":"w","v":"array"},[{"t":"f","v":"+"},{"t":"w","v":"i"},{"t":"w","v":"j"}]],{"t":"w","v":"y"}]]]],[{"t":"f","v":"do"},[{"t":"f","v":"setf"},{"t":"w","v":"i"},[{"t":"f","v":"+"},{"t":"w","v":"i"},{"t":"w","v":"skip"},{"t":"a","v":-1}]],[{"t":"f","v":"set"},{"t":"w","v":"result"},[{"t":"f","v":"length"},{"t":"w","v":"result"}],{"t":"w","v":"cursor"}],[{"t":"f","v":"setf"},{"t":"w","v":"cursor"},{"t":"a","v":""}],{"t":"w","v":"i"}],[{"t":"f","v":"do"},[{"t":"f","v":"setf"},{"t":"w","v":"cursor"},[{"t":"f","v":"concatenate"},{"t":"w","v":"cursor"},[{"t":"f","v":"get"},{"t":"w","v":"array"},{"t":"w","v":"i"}]]],{"t":"w","v":"i"}]],{"t":"w","v":"bounds"}],[{"t":"f","v":"iterate"},{"t":"w","v":"result"},[{"t":"f","v":"+"},{"t":"w","v":"i"},{"t":"a","v":1}],{"t":"w","v":"bounds"}],{"t":"w","v":"result"}]],[{"t":"f","v":"set"},[{"t":"f","v":"defconstant"},{"t":"w","v":"iteration-result"},[{"t":"f","v":"iterate"},[{"t":"f","v":"Array"}],{"t":"a","v":0},[{"t":"f","v":"-"},[{"t":"f","v":"length"},{"t":"w","v":"array"}],{"t":"a","v":1}]]],[{"t":"f","v":"length"},{"t":"w","v":"iteration-result"}],{"t":"w","v":"cursor"}]]],[{"t":"f","v":"deftype"},{"t":"w","v":"split-by-lines"},[{"t":"f","v":"Lambda"},[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"Array"},[{"t":"f","v":"String"}]]]]],[{"t":"f","v":"defun"},{"t":"w","v":"split-by-lines"},{"t":"w","v":"string"},[{"t":"f","v":"regex-match"},{"t":"w","v":"string"},{"t":"a","v":"[^\n]+"}]],[{"t":"f","v":"deftype"},{"t":"w","v":"split-by"},[{"t":"f","v":"Lambda"},[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"String"}]],[{"t":"f","v":"Or"},[{"t":"f","v":"Array"},[{"t":"f","v":"String"}]]]]],[{"t":"f","v":"defun"},{"t":"w","v":"split-by"},{"t":"w","v":"string"},{"t":"w","v":"delim"},[{"t":"f","v":"regex-match"},{"t":"w","v":"string"},[{"t":"f","v":"concatenate"},{"t":"a","v":"[^"},{"t":"w","v":"delim"},{"t":"a","v":"]+"}]]],[{"t":"f","v":"Array"},[{"t":"f","v":"Array"},{"t":"a","v":"split-by-lines"},{"t":"w","v":"split-by-lines"}],[{"t":"f","v":"Array"},{"t":"a","v":"split-by"},{"t":"w","v":"split-by"}],[{"t":"f","v":"Array"},{"t":"a","v":"split-by-n-lines"},{"t":"w","v":"split-by-n-lines"}],[{"t":"f","v":"Array"},{"t":"a","v":"split"},{"t":"w","v":"split"}],[{"t":"f","v":"Array"},{"t":"a","v":"join"},{"t":"w","v":"join"}],[{"t":"f","v":"Array"},{"t":"a","v":"trim"},{"t":"w","v":"trim"}],[{"t":"f","v":"Array"},{"t":"a","v":"left-pad"},{"t":"w","v":"left-pad"}],[{"t":"f","v":"Array"},{"t":"a","v":"right-pad"},{"t":"w","v":"right-pad"}],[{"t":"f","v":"Array"},{"t":"a","v":"to-upper-case"},{"t":"w","v":"to-upper-case"}],[{"t":"f","v":"Array"},{"t":"a","v":"to-lower-case"},{"t":"w","v":"to-lower-case"}],[{"t":"f","v":"Array"},{"t":"a","v":"character-occurances-in-string"},{"t":"w","v":"character-occurances-in-string"}]]]]]