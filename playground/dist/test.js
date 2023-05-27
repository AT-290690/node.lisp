var log = (msg) => console.log(msg), msg,_set = (array, index, value) => { array[index] = value; return array },_cast = (value) => typeof value === 'number' ? String(value) : Number(value);
var _NL = "\n";
var sample,push,max,min,map,reduce,join,string_to_array,split_by_lines;
((sample=`1721
979
366
299
675
1456`), sample);
((push=(array,value) => { return _set(array,array.length,value);}), push);
((max=(a,b) => { return (+(a>b)?a:b);}), max);
((min=(a,b) => { return (+(a<b)?a:b);}), min);
((map=(array,callback) => {var new_array,i,loop; return (((new_array=(new Array(0).fill(0))), new_array),((i=0), i),((loop=(i,bounds) => { return (_set(new_array,i,callback(array.at(i),i)),(+(i<bounds)?loop((i+1),bounds):new_array));}), loop),loop(0,(array.length-1)));}), map);
((reduce=(array,callback,initial) => {var loop; return (((loop=(i,bounds) => { return (((initial=callback(initial,array.at(i),i)),initial),(+(i<bounds)?loop((i+1),bounds):initial));}), loop),loop(0,(array.length-1)));}), reduce);
((join=(array,delim) => { return reduce(array,(a,x,i) => { return (a+delim+x);},``);}), join);
((string_to_array=(string,delim) => { return reduce([...string],(a,x,i) => { return (+(x===delim)?push(a,(new Array(0).fill(0))):(push(a.at(-1),x),a));},push((new Array(0).fill(0)),(new Array(0).fill(0))));}), string_to_array);
((split_by_lines=(string) => { return map(string_to_array(string,_NL),(x,i) => { return join(x,``);});}), split_by_lines);
log(map(split_by_lines(sample),(x,i) => { return _cast(x)}));