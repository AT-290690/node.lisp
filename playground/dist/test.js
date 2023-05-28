var log = (msg) => console.log(msg), msg,_set = (array, index, value) => { array[index] = value; return array },_tco = function (fn) { return function () {
let result = fn(...arguments)
while (typeof result === 'function') result = result()
return result }};
var _NL = "\n";
var max,min,is_odd,is_even,sum,push,euclidean_mod,concat,merge,range,map,for_each,filter,reduce,deep_flat,find,array;
((max=(a,b)=>{return (+(a>b)?a:b);}), max);
((find=(array,callback)=>{var iterate;return (((iterate=_tco(function iterate(i,bounds) {var current; return (((current=array.at(i)), current),((+!callback(current,i)&&+(i<bounds))?iterate((i+1),bounds):current));})), iterate),iterate(0,(array.length-1)));}), find);
((find=(array,callback)=>{var iterate; return (((iterate=_tco(function iterate(i,bounds) {var current; return (((current=array.at(i)), current),((+!callback(current,i)&&+(i<bounds))?iterate((i+1),bounds):current));})), iterate),iterate(0,(array.length-1)));}), find);
((array=[1,2,3,4,5,6]), array);
log(max(find(array,(x,i)=>{ return +(i===2);}),find(array,(x,i)=>{ return +(i===4);})));
log((Array.isArray((new Array(10).fill(0)))));