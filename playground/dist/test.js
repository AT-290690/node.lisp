var log = (msg) => console.log(msg), msg,_set = (array, index, value) => { array[index] = value; return array },_tco = function (fn) { return function () {
let result = fn(...arguments)
while (typeof result === 'function') result = result()
return result }};
var _NL = "\n";
var max,min,is_odd,is_even,sum,push,euclidean_mod,concat,merge,range,map,for_each,filter,reduce,deep_flat,find,sort,reverse;
((max=(a,b)=>{return (+(a>b)?a:b);}), max);
((min=(a,b)=>{return (+(a<b)?a:b);}), min);
((is_odd=(x,i)=>{return +((x%2)===1);}), is_odd);
((is_even=(x,i)=>{return +((x%2)===0);}), is_even);
((sum=(a,x,i)=>{return (a+x);}), sum);
((push=(array,value)=>{return _set(array,array.length,value);}), push);
((euclidean_mod=(a,b)=>{return (((a%b)+b)%b);}), euclidean_mod);
((concat=(array1,array2)=>{var iterate;return (((iterate=_tco(function iterate(i,bounds) { return ((+(i<array2.length)?push(array1,array2.at(i)):0),(+(i<bounds)?iterate((i+1),bounds):array1));})), iterate),iterate(0,(array2.length-1)));}), concat);
((merge=(array1,array2)=>{var iterate;return (((iterate=_tco(function iterate(i,bounds) { return (push(array1,array2.at(i)),(+(i<bounds)?iterate((i+1),bounds):array1));})), iterate),iterate(0,(array2.length-1)));}), merge);
((range=(start,end)=>{var array,iterate;return (((array=(new Array(0).fill(0))), array),((iterate=_tco(function iterate(i,bounds) { return (push(array,(i+start)),(+(i<bounds)?iterate((i+1),bounds):array));})), iterate),iterate(0,(end-start)));}), range);
((map=(array,callback)=>{var new_array,i,iterate;return (((new_array=(new Array(0).fill(0))), new_array),((i=0), i),((iterate=_tco(function iterate(i,bounds) { return (_set(new_array,i,callback(array.at(i),i)),(+(i<bounds)?iterate((i+1),bounds):new_array));})), iterate),iterate(0,(array.length-1)));}), map);
((for_each=(array,callback)=>{var iterate;return (((iterate=_tco(function iterate(i,bounds) { return (callback(array.at(i),i),(+(i<bounds)?iterate((i+1),bounds):array));})), iterate),iterate(0,(array.length-1)));}), for_each);
((filter=(array,callback)=>{var new_array,i,iterate;return (((new_array=(new Array(0).fill(0))), new_array),((i=0), i),((iterate=_tco(function iterate(i,bounds) {var current; return (((current=array.at(i)), current),(callback(current,i)?push(new_array,current):0),(+(i<bounds)?iterate((i+1),bounds):new_array));})), iterate),iterate(0,(array.length-1)));}), filter);
((reduce=(array,callback,initial)=>{var iterate;return (((iterate=_tco(function iterate(i,bounds) { return (((initial=callback(initial,array.at(i),i)),initial),(+(i<bounds)?iterate((i+1),bounds):initial));})), iterate),iterate(0,(array.length-1)));}), reduce);
((deep_flat=(arr)=>{var new_array,flatten;return (((new_array=(new Array(0).fill(0))), new_array),((flatten=_tco(function flatten(item) { return ((Array.isArray(item))?for_each(item,(x,_)=>{ return flatten(x);}):push(new_array,item));})), flatten),flatten(arr),new_array);}), deep_flat);
((find=(array,callback)=>{var iterate;return (((iterate=_tco(function iterate(i,bounds) {var current; return (((current=array.at(i)), current),((+!callback(current,i)&&+(i<bounds))?iterate((i+1),bounds):current));})), iterate),iterate(0,(array.length-1)));}), find);
((sort=(arr)=>{var pivot,left_arr,right_arr,iterate,left,right;return (+(arr.length<=1)?arr:(((pivot=arr.at(0)), pivot),((left_arr=(new Array(0).fill(0))), left_arr),((right_arr=(new Array(0).fill(0))), right_arr),((iterate=_tco(function iterate(i,bounds) {var current; return (((current=arr.at(i)), current),(+(current<pivot)?push(left_arr,current):push(right_arr,current)),(+(i<bounds)?iterate((i+1),bounds):0));})), iterate),iterate(1,(arr.length-1)),((left_arr.length&&right_arr.length)),((left=sort(left_arr)), left),((right=sort(right_arr)), right),concat(push(left,pivot),right)));}), sort);
((reverse=(array)=>{var len,reversed,offset,iterate;return (((len=array.length), len),((reversed=(new Array(len).fill(0))), reversed),((offset=(len-1)), offset),((iterate=_tco(function iterate(i,bounds) { return (_set(reversed,(offset-i),array.at(i)),(+(i<bounds)?iterate((i+1),bounds):reversed));})), iterate),iterate(0,offset));}), reverse);
((push=(array,value)=>{return _set(array,array.length,value);}), push);
((concat=(array1,array2)=>{var iterate;return (((iterate=_tco(function iterate(i,bounds) { return ((+(i<array2.length)?push(array1,array2.at(i)):0),(+(i<bounds)?iterate((i+1),bounds):array1));})), iterate),iterate(0,(array2.length-1)));}), concat);
((sort=(arr)=>{var pivot,left_arr,right_arr,iterate,left,right;return (+(arr.length<=1)?arr:(((pivot=arr.at(0)), pivot),((left_arr=(new Array(0).fill(0))), left_arr),((right_arr=(new Array(0).fill(0))), right_arr),((iterate=_tco(function iterate(i,bounds) {var current; return (((current=arr.at(i)), current),(+(current<pivot)?push(left_arr,current):push(right_arr,current)),(+(i<bounds)?iterate((i+1),bounds):0));})), iterate),iterate(1,(arr.length-1)),((left_arr.length&&right_arr.length)),((left=sort(left_arr)), left),((right=sort(right_arr)), right),concat(push(left,pivot),right)));}), sort);
((reverse=(array)=>{var len,reversed,offset,iterate;return (((len=array.length), len),((reversed=(new Array(len).fill(0))), reversed),((offset=(len-1)), offset),((iterate=_tco(function iterate(i,bounds) { return (_set(reversed,(offset-i),array.at(i)),(+(i<bounds)?iterate((i+1),bounds):reversed));})), iterate),iterate(0,offset));}), reverse);
log(reverse(sort([1,0,8,-2,3])));