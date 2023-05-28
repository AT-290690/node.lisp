var log = (msg) => console.log(msg), msg,_set = (array, index, value) => { array[index] = value; return array },_tco = (fn) => (...args) => {
      let result = fn(...args)
      while (typeof result === 'function') result = result()
      return result
    }
  ;
var _NL = "\n";
var push,concat,quick_sort;
((push=(array,value) => { return _set(array,array.length,value);}), push);
((concat=(array1,array2) => {var loop; return (((loop=_tco(function loop (i,bounds) { return (push(array1,array2.at(i)),(+(i<bounds)?loop((i+1),bounds):array1));})), loop),loop(0,(array2.length-1)));}), concat);
((quick_sort=(arr) => {var pivot,left_arr,right_arr,loop; return (+(arr.length<=1)?arr:(((pivot=arr.at(0)), pivot),((left_arr=(new Array(0).fill(0))), left_arr),((right_arr=(new Array(0).fill(0))), right_arr),((loop=_tco(function loop (i,bounds) {var current; return (((current=arr.at((i-1))), current),(+(current<pivot)?push(left_arr,current):push(right_arr,current)),(+(i<bounds)?loop((i+1),bounds):0));})), loop),loop(1,arr.length),[...concat(push(quick_sort(left_arr),pivot),quick_sort(right_arr))]));}), quick_sort);
quick_sort([7,1,4]);