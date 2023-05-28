var log = (msg) => console.log(msg), msg,_set = (array, index, value) => { array[index] = value; return array },_tco = (fn) => (...args) => {
      let result = fn(...args)
      while (typeof result === 'function') result = result()
      return result
    }
  ;
var _NL = "\n";
var range,map,filter,reduce,is_odd,mult_2,sum;
((range=(start,end) => {var array,loop; return (((array=(new Array(0).fill(0))), array),((loop=_tco(function loop (i,bounds) { return (_set(array,i,(i+start)),(+(i<bounds)?loop((i+1),bounds):array));})), loop),loop(0,(end-start)));}), range);
((map=(array,callback) => {var new_array,i,loop; return (((new_array=(new Array(0).fill(0))), new_array),((i=0), i),((loop=_tco(function loop (i,bounds) { return (_set(new_array,i,callback(array.at(i),i)),(+(i<bounds)?loop((i+1),bounds):new_array));})), loop),loop(0,(array.length-1)));}), map);
((filter=(array,callback) => {var new_array,i,loop; return (((new_array=(new Array(0).fill(0))), new_array),((i=0), i),((loop=_tco(function loop (i,bounds) {var current; return (((current=array.at(i)), current),(callback(current,i)?_set(new_array,new_array.length,current):0),(+(i<bounds)?loop((i+1),bounds):new_array));})), loop),loop(0,(array.length-1)));}), filter);
((reduce=(array,callback,initial) => {var loop; return (((loop=_tco(function loop (i,bounds) { return (((initial=callback(initial,array.at(i),i)),initial),(+(i<bounds)?loop((i+1),bounds):initial));})), loop),loop(0,(array.length-1)));}), reduce);
((is_odd=(x,i) => { return +((x%2)===1);}), is_odd);
((mult_2=(x,i) => { return (x*2);}), mult_2);
((sum=(a,x,i) => { return (a+x);}), sum);
log(range(1,5000));