import { evaluate } from './interpreter.js'
const maxCallstackLimitInterpretation = 256
export const tokens = {
  ['concatenate']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (concatenate), expected > 1 but got ${args.length}.`
      )
    return args.map((x) => evaluate(x, env)).reduce((a, b) => a + b, '')
  },
  ['mod']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (mod), expected > 1 but got ${args.length}.`
      )
    const [a, b] = args.map((x) => evaluate(x, env))
    if (typeof a !== 'number' || typeof b !== 'number')
      throw new TypeError(`Not all arguments for (mod) are numbers.`)
    return a % b
  },
  ['/']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (/), expected 1 but got ${args.length}.`
      )
    const number = evaluate(args[0], env)
    if (typeof number !== 'number')
      throw new TypeError(`Arguments of (/) is not a number.`)
    return 1 / number
  },
  ['+']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (+), expected > 1 but got ${args.length}.`
      )
    const operands = args.map((x) => evaluate(x, env))
    if (!operands.every((x) => typeof x === 'number'))
      throw new TypeError(`Not all arguments for (+) are numbers.`)
    return operands.reduce((a, b) => a + b)
  },
  ['...']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError('Invalid number of arguments for (...) (1 required)')
    const iterable = evaluate(args[0], env)
    if (typeof iterable[Symbol.iterator] !== 'function')
      throw new TypeError('Argument is not iterable for (...).')
    return [...iterable]
  },
  ['length']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        'Invalid number of arguments for (length) (1 required)'
      )
    const array = evaluate(args[0], env)
    if (!Array.isArray(array))
      throw new TypeError('First argument of (length) must be an (Array).')
    return array.length
  },
  ['Arrayp']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        'Invalid number of arguments for (Arrayp) (1 required)'
      )
    const array = evaluate(args[0], env)
    return +Array.isArray(array)
  },
  ['Numberp']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        'Invalid number of arguments for (Numberp) (1 required)'
      )
    return +(typeof evaluate(args[0], env) === 'number')
  },
  ['Stringp']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        'Invalid number of arguments for (Stringp) (1 required)'
      )
    return +(typeof evaluate(args[0], env) === 'string')
  },
  ['char']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError(
        'Invalid number of arguments for (char) (2 required)'
      )
    const string = evaluate(args[0], env)
    if (typeof string !== 'string')
      throw new TypeError('First argument of (char) must be an (String).')
    const index = evaluate(args[1], env)
    if (!Number.isInteger(index) || index < 0)
      throw new TypeError('Second argument of (char) must be an (+ Integer).')
    return string.charCodeAt(index)
  },
  ['*']: (args, env) =>
    args.map((x) => evaluate(x, env)).reduce((a, b) => a * b),
  ['-']: (args, env) =>
    args.map((x) => evaluate(x, env)).reduce((a, b) => a - b),
  ['if']: (args, env) =>
    evaluate(args[0], env) ? evaluate(args[1], env) : evaluate(args[2], env),
  ['Array']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        'Invalid number of arguments for (Array) (>= 1 required)'
      )
    return args.length === 1
      ? new Array(evaluate(args[0], env)).fill(0)
      : args.map((x) => evaluate(x, env))
  },
  ["'"]: (args, env) => {
    if (!args.length)
      throw new RangeError(
        "Invalid number of arguments for (') (>= 1 required)"
      )
    return args.map((x) => evaluate(x, env))
  },
  ['get']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError('Invalid number of arguments for (get) (2 required)')
    const array = evaluate(args[0], env)
    if (!Array.isArray(array))
      throw new TypeError('First argument of (get) must be an (Array).')
    if (array.length === 0)
      throw new RangeError(`First argument of (get) is an empty (Array).`)
    const index = evaluate(args[1], env)
    if (!Number.isInteger(index))
      throw new TypeError(
        `Second argument of (get) must be an integer (${index}).`
      )
    if (index > array.length - 1)
      throw new RangeError(
        `Second argument of (get) is outside of the (Array) bounds (${index}).`
      )
    const value = array.at(index)
    if (value == undefined)
      throw new RangeError(`Trying to get a null value in (Array) at (get).`)
    return array.at(index)
  },
  ['set']: (args, env) => {
    if (args.length !== 2 && args.length !== 3)
      throw new RangeError(
        'Invalid number of arguments for (set) (2 or 3 required)'
      )
    const array = evaluate(args[0], env)
    if (!Array.isArray(array))
      throw new TypeError(`First argument of (set) must be an (Array).`)
    const index = evaluate(args[1], env)
    if (!Number.isInteger(index))
      throw new TypeError(
        `Second argument of (set) must be an integer (${index}).`
      )
    if (index > array.length)
      throw new RangeError(
        `Second argument of (set) is outside of the (Array) bounds (index ${index} bounds ${array.length}).`
      )
    if (index < 0) {
      if (args.length !== 2)
        throw new RangeError(
          'Invalid number of arguments for (set) (if index is < 0 then 2 required)'
        )
      if (index * -1 > array.length)
        throw new RangeError(
          `Second argument of (set) is outside of the (Array) bounds (index ${index} bounds ${array.length})`
        )
      const target = array.length + index
      while (array.length !== target) array.pop()
    } else {
      if (args.length !== 3)
        throw new RangeError(
          'Invalid number of arguments for (set) (if index is >= 0 then 3 required)'
        )
      const value = evaluate(args[2], env)
      if (value == undefined)
        throw new RangeError(`Trying to set a null value in (Array) at (set).`)
      array[index] = value
    }
    return array
  },
  ['log']: (args, env) => {
    const expressions = args.map((x) => evaluate(x, env))
    console.log(...expressions)
    return expressions.at(-1)
  },
  ['block']: (args, env) => args.reduce((_, x) => evaluate(x, env), 0),
  ['function']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments to function [2 required]'
      )
    const params = args.slice(1, -1)
    if (!params.length)
      throw new RangeError(
        'Invalid number of params for (function) (>= 1 required)'
      )
    const body = args.at(-1)
    const name = args[0].value
    const fn = (props, scope) => {
      if (props.length > params.length) {
        throw new RangeError(
          `More arguments for (function ${params
            .map((x) => x.value)
            .join(' ')
            .trim()}) are provided.`
        )
      }
      if (props.length !== params.length)
        throw new RangeError(
          `Not all arguments for (function ${params
            .map((x) => x.value)
            .join(' ')
            .trim()}) are provided.`
        )
      const localEnv = Object.create(env)
      for (let i = 0; i < props.length; ++i)
        localEnv[params[i].value] = evaluate(props[i], scope)
      return evaluate(body, localEnv)
    }
    env[name] = fn
    return fn
  },
  ['lambda']: (args, env) => {
    const params = args.slice(0, -1)
    if (!params.length)
      throw new RangeError(
        'Invalid number of arguments for (lambda) (>= 1 required)'
      )
    const body = args.at(-1)
    return (props, scope) => {
      if (props.length !== params.length)
        throw new RangeError(
          `Not all arguments for (lambda ${params
            .map((x) => x.value)
            .join(' ')}) are provided.`
        )
      const localEnv = Object.create(env)
      for (let i = 0; i < props.length; ++i)
        localEnv[params[i].value] = evaluate(props[i], scope)
      return evaluate(body, localEnv)
    }
  },
  ['not']: (args, env) => +!evaluate(args[0], env),
  ['=']: (args, env) => {
    const a = evaluate(args[0], env)
    const b = evaluate(args[1], env)
    if (
      Array.isArray(a) ||
      Array.isArray(b) ||
      typeof a === 'function' ||
      typeof b === 'function'
    )
      throw new TypeError(
        'Invalid use of (=), some arguments are not primitive'
      )
    return +(a === b)
  },
  ['eq']: (args, env) => +(evaluate(args[0], env) === evaluate(args[1], env)),
  ['<']: (args, env) => +(evaluate(args[0], env) < evaluate(args[1], env)),
  ['>']: (args, env) => +(evaluate(args[0], env) > evaluate(args[1], env)),
  ['>=']: (args, env) => +(evaluate(args[0], env) >= evaluate(args[1], env)),
  ['<=']: (args, env) => +(evaluate(args[0], env) <= evaluate(args[1], env)),
  ['and']: (args, env) => {
    for (let i = 0; i < args.length - 1; ++i)
      if (evaluate(args[i], env)) continue
      else return evaluate(args[i], env)
    return evaluate(args.at(-1), env)
  },
  ['or']: (args, env) => {
    for (let i = 0; i < args.length - 1; ++i)
      if (evaluate(args[i], env)) return evaluate(args[i], env)
      else continue
    return evaluate(args.at(-1), env)
  },
  ['let']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError('Invalid number of arguments to let [2 required]')
    const name = args[0].value
    const value = evaluate(args[1], env)
    env[name] = value
    return value
  },
  ['let*']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError('Invalid number of arguments to = [2 required]')
    const entityName = args[0].value
    const value = evaluate(args[1], env)
    for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
      if (Object.prototype.hasOwnProperty.call(scope, entityName)) {
        scope[entityName] = value
        return value
      }
    throw new ReferenceError(
      `Tried setting an undefined variable: ${entityName} using (let*)`
    )
  },
  ['regex_match']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments to (regex_match) [2 required]'
      )
    const string = evaluate(args[0], env)
    if (typeof string !== 'string')
      throw new TypeError(
        'First argument of (regex_match) has to be a (string)'
      )
    const regex = evaluate(args[1], env)
    if (typeof regex !== 'string')
      throw new TypeError(
        'Second argument of (regex_match) has to be a (string)'
      )
    const match = string.match(new RegExp(regex, 'g'))
    return match == undefined ? [] : [...match]
  },
  ['format']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments to (format) [2 required]'
      )
    const string = evaluate(args[0], env)
    if (typeof string !== 'string')
      throw new TypeError('First argument of (format) has to be a (string)')
    const delim = evaluate(args[1], env)
    if (typeof delim !== 'string')
      throw new TypeError('Second argument of (format) has to be a (string)')

    return string.split(delim)
  },
  ['loop']: (args, env) => {
    if (args.length < 2)
      throw new RangeError('Invalid number of arguments to (loop) [2 required]')
    const params = args.slice(1, -1)
    if (!params.length)
      throw new RangeError(
        'Invalid number of arguments for (loop) (>= 1 required)'
      )
    const body = args.at(-1)
    const name = args[0].value
    let count = -1
    const fn = (props, env) => {
      if (count > maxCallstackLimitInterpretation)
        throw new RangeError(
          `Recursive (loop) reached maximum ${maxCallstackLimitInterpretation} calls.\n For calls (> ${maxCallstackLimitInterpretation}), compile instead.`
        )
      if (props.length !== params.length)
        throw new RangeError(
          `Not all arguments for (loop ${params
            .map((x) => x.value)
            .join(' ')}) are provided.`
        )
      const localEnv = Object.create(env)
      for (let i = 0; i < props.length; ++i)
        localEnv[params[i].value] = evaluate(props[i], localEnv)
      ++count
      return evaluate(body, localEnv)
    }
    env[name] = fn
    return fn
  },
  ['String']: () => '',
  ['Number']: () => 0,
  ['type']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError(
        `Invalid number of arguments for (type) ${args.length}`
      )
    const type = args[0]
    const value = evaluate(args[1], env)
    if (value == undefined)
      throw ReferenceError('Trying to access undefined value at (type)')
    if (type.value === 'Number') {
      const num = Number(value)
      if (isNaN(num))
        throw new TypeError(
          `Attempting to convert Not a Number ("${value}") to a Number at (type)`
        )
      return num
    } else if (type.value === 'String') return value.toString()
    else if (type.value === 'Array') return [value]
    else throw new TypeError('Can only cast number or string at (type)')
  },
  ['bit']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError('Invalid number of arguments to (bit) (1 required).')
    return (evaluate(args[0], env) >>> 0).toString(2)
  },
  ['&']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments to (&) (>= 2 required).'
      )
    const operands = args.map((a) => evaluate(a, env))
    return operands.reduce((acc, x) => acc & x)
  },
  ['~']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError('Invalid number of arguments to (~) (1 required).')
    return ~evaluate(args[0], env)
  },
  ['|']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments to (|) (>= 2 required).'
      )
    const operands = args.map((a) => evaluate(a, env))
    return operands.reduce((acc, x) => acc | x)
  },
  ['^']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments to (^) (>= 2 required).'
      )
    const operands = args.map((a) => evaluate(a, env))
    return operands.reduce((acc, x) => acc ^ x)
  },
  ['<<']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments to (<<) (>= 2 required).'
      )
    const operands = args.map((a) => evaluate(a, env))
    return operands.reduce((acc, x) => acc << x)
  },
  ['>>']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments to (>>) (>= 2 required).'
      )
    const operands = args.map((a) => evaluate(a, env))
    return operands.reduce((acc, x) => acc >> x)
  },
  ['>>>']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments to (>>>) (>= 2 required).'
      )
    const operands = args.map((a) => evaluate(a, env))
    return operands.reduce((acc, x) => acc >>> x)
  },
  ['esc']: (args, env) => ({ n: '\n' }[evaluate(args[0], env)]),
  ['do']: (args, env) => {
    let inp = args[0]
    for (let i = 1; i < args.length; ++i) {
      if (!Array.isArray(args[i]))
        throw new TypeError(
          `Argument at position (${i}) of (do) is not a (function).`
        )
      const [first, ...rest] = args[i]
      const arr = [first, inp, ...rest]
      inp = arr
    }
    return evaluate(inp, env)
  },
}
