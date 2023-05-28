var log = (msg) => console.log(msg),
  msg,
  _set = (array, index, value) => {
    array[index] = value
    return array
  },
  _tco = function (fn) {
    return function () {
      let result = fn(...arguments)
      while (typeof result === 'function') result = result()
      return result
    }
  }
var _NL = '\n'
var max,
  min,
  is_odd,
  is_even,
  sum,
  push,
  euclidean_mod,
  concat,
  range,
  map,
  for_each,
  filter,
  reduce,
  deep_flat,
  arr
;(max = (a, b) => {
  return +(a > b) ? a : b
}),
  max
;(min = (a, b) => {
  return +(a < b) ? a : b
}),
  min
;(is_odd = (x, i) => {
  return +(x % 2 === 1)
}),
  is_odd
;(is_even = (x, i) => {
  return +(x % 2 === 0)
}),
  is_even
;(sum = (a, x, i) => {
  return a + x
}),
  sum
;(push = (array, value) => {
  return _set(array, array.length, value)
}),
  push
;(euclidean_mod = (a, b) => {
  return ((a % b) + b) % b
}),
  euclidean_mod
;(concat = (array1, array2) => {
  var loop
  return (
    ((loop = _tco(function loop(i, bounds) {
      return (
        push(array1, array2.at(i)), +(i < bounds) ? loop(i + 1, bounds) : array1
      )
    })),
    loop),
    loop(0, array2.length - 1)
  )
}),
  concat
;(range = (start, end) => {
  var array, loop
  return (
    ((array = new Array(0).fill(0)), array),
    ((loop = _tco(function loop(i, bounds) {
      return push(array, i + start), +(i < bounds) ? loop(i + 1, bounds) : array
    })),
    loop),
    loop(0, end - start)
  )
}),
  range
;(map = (array, callback) => {
  var new_array, i, loop
  return (
    ((new_array = new Array(0).fill(0)), new_array),
    ((i = 0), i),
    ((loop = _tco(function loop(i, bounds) {
      return (
        _set(new_array, i, callback(array.at(i), i)),
        +(i < bounds) ? loop(i + 1, bounds) : new_array
      )
    })),
    loop),
    loop(0, array.length - 1)
  )
}),
  map
;(for_each = (array, callback) => {
  var loop
  return (
    ((loop = _tco(function loop(i, bounds) {
      return (
        callback(array.at(i), i), +(i < bounds) ? loop(i + 1, bounds) : array
      )
    })),
    loop),
    loop(0, array.length - 1)
  )
}),
  for_each
;(filter = (array, callback) => {
  var new_array, i, loop
  return (
    ((new_array = new Array(0).fill(0)), new_array),
    ((i = 0), i),
    ((loop = _tco(function loop(i, bounds) {
      var current
      return (
        ((current = array.at(i)), current),
        callback(current, i) ? push(new_array, current) : 0,
        +(i < bounds) ? loop(i + 1, bounds) : new_array
      )
    })),
    loop),
    loop(0, array.length - 1)
  )
}),
  filter
;(reduce = (array, callback, initial) => {
  var loop
  return (
    ((loop = _tco(function loop(i, bounds) {
      return (
        ((initial = callback(initial, array.at(i), i)), initial),
        +(i < bounds) ? loop(i + 1, bounds) : initial
      )
    })),
    loop),
    loop(0, array.length - 1)
  )
}),
  reduce
;(deep_flat = (arr) => {
  var new_array, flatten
  return (
    ((new_array = new Array(0).fill(0)), new_array),
    ((flatten = _tco(function flatten(item) {
      return Array.isArray(item)
        ? for_each(item, (x, _) => {
            return flatten(x)
          })
        : push(new_array, item)
    })),
    flatten),
    flatten(arr),
    new_array
  )
}),
  deep_flat
;(arr = [
  [1, 2],
  [1, 2],
  [1, 3],
  [1, [4, 4, [`x`, `y`]]],
  [1, 2],
]),
  arr
log(deep_flat(arr), arr)
