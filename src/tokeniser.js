import { evaluate } from './interpreter.js'
const stringifyArgs = (args) =>
  args
    .map((x) => {
      return Array.isArray(x)
        ? `(${stringifyArgs(x)})`
        : x.type === 'apply' || x.type === 'word'
        ? x.value
        : JSON.stringify(x.value)
            .replace(new RegExp(/\[/g), '(')
            .replace(new RegExp(/\]/g), ')')
            .replace(new RegExp(/\,/g), ' ')
    })
    .join(' ')
const tokens = {
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
      throw new TypeError(
        `Incorrect number of arguments for (mod) are (numbers) (mod ${stringifyArgs(
          args
        )}).`
      )
    if (b === 0)
      throw new TypeError(
        `Second argument of (mod) can't be a (0) (devision by 0 is not allowed) (mod ${stringifyArgs(
          args
        )}).`
      )

    return a % b
  },
  ['/']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (/), expected 1 but got ${args.length}.`
      )
    const number = evaluate(args[0], env)
    if (typeof number !== 'number')
      throw new TypeError(
        `Arguments of (/) is not a (number) (/ ${stringifyArgs(args)}).`
      )
    if (number === 0)
      throw new TypeError(
        `Argument of (/) can't be a (0) (devision by 0 is not allowed) (/ ${stringifyArgs(
          args
        )}).`
      )
    return 1 / number
  },
  ['length']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        'Invalid number of arguments for (length) (1 required)'
      )
    const array = evaluate(args[0], env)
    if (!Array.isArray(array))
      throw new TypeError(
        `First argument of (length) must be an (Array) (length ${stringifyArgs(
          args
        )}).`
      )
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
      throw new TypeError(
        `First argument of (char) must be an (String) (char ${stringifyArgs(
          args
        )}).`
      )
    const index = evaluate(args[1], env)
    if (!Number.isInteger(index) || index < 0)
      throw new TypeError(
        `Second argument of (char) must be an (+ Integer) (char ${stringifyArgs(
          args
        )}).`
      )
    return string.charCodeAt(index)
  },
  ['+']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (+), expected > 1 but got ${args.length}.`
      )
    const operands = args.map((x) => evaluate(x, env))
    if (!operands.every((x) => typeof x === 'number'))
      throw new TypeError(
        `Incorrect number of arguments for (+) are (numbers) (+ ${stringifyArgs(
          args
        )}).`
      )
    return operands.reduce((a, b) => a + b)
  },
  ['*']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (*), expected > 1 but got ${args.length}.`
      )
    const operands = args.map((x) => evaluate(x, env))
    if (!operands.every((x) => typeof x === 'number'))
      throw new TypeError(
        `Incorrect number of arguments for (*) are (numbers) (* ${stringifyArgs(
          args
        )}).`
      )
    return operands.reduce((a, b) => a * b)
  },
  ['-']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        `Invalid number of arguments for (-), expected >= 1 but got ${args.length}.`
      )
    const operands = args.map((x) => evaluate(x, env))
    if (!operands.every((x) => typeof x === 'number'))
      throw new TypeError(
        `Incorrect number of arguments for (-) are (numbers) (- ${stringifyArgs(
          args
        )}).`
      )
    return args.length === 1 ? -operands[0] : operands.reduce((a, b) => a - b)
  },
  ['if']: (args, env) => {
    if (args.length < 2 || args.length > 3)
      throw new RangeError(
        `Invalid number of arguments for (if), expected (or 2 3) but got ${
          args.length
        } (if ${stringifyArgs(args)}).`
      )
    return evaluate(args[0], env)
      ? evaluate(args[1], env)
      : evaluate(args[2], env)
  },
  ['unless']: (args, env) => {
    if (args.length < 2 || args.length > 3)
      throw new RangeError(
        `Invalid number of arguments for (unless), expected (or 2 3)  but got ${
          args.length
        } (unless ${stringifyArgs(args)}).`
      )
    return evaluate(args[0], env)
      ? evaluate(args[2], env)
      : evaluate(args[1], env)
  },
  ['cond']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (cond), expected (> 2 required) but got ${
          args.length
        } (cond ${stringifyArgs(args)}).`
      )
    for (let i = 0; i < args.length; i += 2) {
      if (evaluate(args[i], env)) return evaluate(args[i + 1], env)
    }
    return 0
  },
  ['Array']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        'Invalid number of arguments for (Array) (>= 1 required)'
      )
    const isCapacity =
      args.length === 2 && args[1].type === 'word' && args[1].value === 'length'
    if (isCapacity) {
      const N = evaluate(args[0], env)
      if (args.length !== 2)
        throw new RangeError(
          'Invalid number of arguments for (Array) (= 2 required)'
        )
      if (!Number.isInteger(N))
        throw new TypeError(
          `Size argument for (Array) has to be an integer (Array ${stringifyArgs(
            args
          )})`
        )
      return new Array(N).fill(0)
    }
    return args.map((x) => evaluate(x, env))
  },
  ['atom']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        'Invalid number of arguments for (Atomp) (1 required)'
      )
    if (args[0].type === 'atom') return 1
    else {
      const atom = evaluate(args[0], env)
      return +(typeof atom === 'number' || typeof atom === 'string')
    }
  },
  ['car']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError('Invalid number of arguments for (car) (1 required)')
    const array = evaluate(args[0], env)
    if (!Array.isArray(array))
      throw new TypeError(
        `Argument of (car) must be an (Array) (car ${stringifyArgs(args)}).`
      )
    if (array.length === 0)
      throw new RangeError(
        `Argument of (car) is an empty (Array) (car ${stringifyArgs(args)}).`
      )
    const value = array.at(0)
    if (value == undefined)
      throw new RangeError(
        `Trying to get a null value in (Array) at (car) (car ${stringifyArgs(
          args
        )}).`
      )
    return value
  },
  ['cdr']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError('Invalid number of arguments for (cdr) (1 required)')
    const array = evaluate(args[0], env)
    if (!Array.isArray(array))
      throw new TypeError(
        `Argument of (cdr) must be an (Array) (cdr ${stringifyArgs(args)}).`
      )
    if (array.length === 0)
      throw new RangeError(
        `Argument of (cdr) is an empty (Array) (cdr ${stringifyArgs(args)}).`
      )
    return array.slice(1)
  },
  ['get']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError('Invalid number of arguments for (get) (2 required)')
    const array = evaluate(args[0], env)
    if (!Array.isArray(array))
      throw new TypeError(
        `First argument of (get) must be an (Array) (get ${stringifyArgs(
          args
        )}).`
      )
    if (array.length === 0)
      throw new RangeError(
        `First argument of (get) is an empty (Array) (get ${stringifyArgs(
          args
        )})).`
      )
    const index = evaluate(args[1], env)
    if (!Number.isInteger(index))
      throw new TypeError(
        `Second argument of (get) must be an integer (${index}) (get ${stringifyArgs(
          args
        )}).`
      )
    if (index > array.length - 1)
      throw new RangeError(
        `Second argument of (get) is outside of the (Array) bounds (${index}) (get ${stringifyArgs(
          args
        )}).`
      )
    const value = array.at(index)
    if (value == undefined)
      throw new RangeError(
        `Trying to get a null value in (Array) at (get) (get ${stringifyArgs(
          args
        )}).`
      )
    return value
  },
  ['set']: (args, env) => {
    if (args.length !== 2 && args.length !== 3)
      throw new RangeError(
        'Invalid number of arguments for (set) (or 2 3) required'
      )
    const array = evaluate(args[0], env)
    if (!Array.isArray(array))
      throw new TypeError(
        `First argument of (set) must be an (Array) (set ${stringifyArgs(
          args
        )}).`
      )
    const index = evaluate(args[1], env)
    if (!Number.isInteger(index))
      throw new TypeError(
        `Second argument of (set) must be an integer (${index}) (set ${stringifyArgs(
          args
        )}).`
      )
    if (index > array.length)
      throw new RangeError(
        `Second argument of (set) is outside of the (Array) bounds (index ${index} bounds ${
          array.length
        }) (set ${stringifyArgs(args)}).`
      )
    if (index < 0) {
      if (args.length !== 2)
        throw new RangeError(
          'Invalid number of arguments for (set) (if index is < 0 then 2 required)'
        )
      if (index * -1 > array.length)
        throw new RangeError(
          `Second argument of (set) is outside of the (Array) bounds (index ${index} bounds ${
            array.length
          }) (set ${stringifyArgs(args)})`
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
        throw new RangeError(
          `Trying to set a null value in (Array) at (set). (set ${stringifyArgs(
            args
          )})`
        )
      array[index] = value
    }
    return array
  },
  ['probe-file']: (_, env) => {
    let out = {}
    let total = 0
    for (const item in env) {
      const current = env[item]
      if (current.count) {
        total += current.count
        out[item] = current.count
      }
    }
    return [Object.entries(out), ['⏱️ ', total]]
  },
  ['log']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        'Invalid number of arguments to (log) (>= 1 required)'
      )
    const expressions = args.map((x) => evaluate(x, env))
    console.log(...expressions)
    return expressions.at(-1)
  },
  ['do']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        'Invalid number of arguments to (do) (>= 1 required)'
      )
    return args.reduce((_, x) => evaluate(x, env), 0)
  },
  ['defun']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments to (defun) (2 required)'
      )
    const params = args.slice(1, -1)
    const body = args.at(-1)
    const name = args[0].value
    const fn = (props = [], scope) => {
      if (props.length > params.length) {
        throw new RangeError(
          `More arguments for (defun ${name} ${params
            .map((x) => x.value)
            .join(' ')
            .trim()}) are provided. (expects ${params.length} but got ${
            props.length
          })`
        )
      }
      if (props.length !== params.length)
        throw new RangeError(
          `Incorrect number of arguments for (defun ${name} ${params
            .map((x) => x.value)
            .join(' ')
            .trim()}) are provided. (expects ${params.length} but got ${
            props.length
          })`
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
    // if (!params.length)
    //   throw new RangeError(
    //     'Invalid number of arguments for (lambda) (>= 1 required)'
    //   )
    const body = args.at(-1)
    return (props = [], scope) => {
      if (props.length !== params.length)
        throw new RangeError(
          `Incorrect number of arguments for (lambda ${params
            .map((x) => x.value)
            .join(' ')}) are provided. (expects ${params.length} but got ${
            props.length
          })`
        )
      const localEnv = Object.create(env)
      for (let i = 0; i < props.length; ++i)
        localEnv[params[i].value] = evaluate(props[i], scope)
      return evaluate(body, localEnv)
    }
  },
  ['not']: (args, env) => +!evaluate(args[0], env),
  ['=']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError('Invalid number of arguments for (=) (2 required)')
    const a = evaluate(args[0], env)
    const b = evaluate(args[1], env)
    if (
      Array.isArray(a) ||
      Array.isArray(b) ||
      typeof a === 'function' ||
      typeof b === 'function'
    )
      throw new TypeError(
        `Invalid use of (=), some arguments are not an atom (= ${stringifyArgs(
          args
        )})`
      )
    return +(a === b)
  },
  ['<']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError('Invalid number of arguments for (<) (2 required)')
    const a = evaluate(args[0], env)
    const b = evaluate(args[1], env)
    if (
      Array.isArray(a) ||
      Array.isArray(b) ||
      typeof a === 'function' ||
      typeof b === 'function'
    )
      throw new TypeError(
        `Invalid use of (<), some arguments are not an atom (< ${stringifyArgs(
          args
        )})`
      )
    return +(a < b)
  },
  ['>']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError('Invalid number of arguments for (>) (2 required)')
    const a = evaluate(args[0], env)
    const b = evaluate(args[1], env)
    if (
      Array.isArray(a) ||
      Array.isArray(b) ||
      typeof a === 'function' ||
      typeof b === 'function'
    )
      throw new TypeError(
        `Invalid use of (>), some arguments are not an atom (> ${stringifyArgs(
          args
        )})`
      )
    return +(a > b)
  },
  ['>=']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError('Invalid number of arguments for (>=) (2 required)')
    const a = evaluate(args[0], env)
    const b = evaluate(args[1], env)
    if (
      Array.isArray(a) ||
      Array.isArray(b) ||
      typeof a === 'function' ||
      typeof b === 'function'
    )
      throw new TypeError(
        `Invalid use of (>=), some arguments are not an atom (>= ${stringifyArgs(
          args
        )})`
      )
    return +(a >= b)
  },
  ['<=']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError('Invalid number of arguments for (<=) (2 required)')
    const a = evaluate(args[0], env)
    const b = evaluate(args[1], env)
    if (
      Array.isArray(a) ||
      Array.isArray(b) ||
      typeof a === 'function' ||
      typeof b === 'function'
    )
      throw new TypeError(
        `Invalid use of (<=), some arguments are not an atom (<= ${stringifyArgs(
          args
        )})`
      )
    return +(a <= b)
  },
  ['and']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments for (and) (>= 2 required)'
      )
    for (let i = 0; i < args.length - 1; ++i)
      if (evaluate(args[i], env)) continue
      else return evaluate(args[i], env)
    return evaluate(args.at(-1), env)
  },
  ['or']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments for (or) (>= 2 required)'
      )
    for (let i = 0; i < args.length - 1; ++i)
      if (evaluate(args[i], env)) return evaluate(args[i], env)
      else continue
    return evaluate(args.at(-1), env)
  },
  ['apply']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        'Invalid number of arguments to (apply) (>= 1 required)'
      )
    const [first, ...rest] = args
    if (first.type === 'word' && first.value in tokens)
      throw new TypeError(
        `Following argument of (apply) must not be an reserved word (apply ${stringifyArgs(
          args
        )})`
      )
    const apply = evaluate(first, env)
    if (typeof apply !== 'function')
      throw new TypeError(
        `First argument of (apply) must be a (lambda) (${stringifyArgs(args)})`
      )

    return apply(rest, env)
  },
  ['defvar']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments to (defvar) (> 2 required)'
      )
    if (args.length % 2 === 1)
      throw new RangeError(
        'Invalid number of arguments to (defvar) (pairs of 2 required)'
      )
    let name
    for (let i = 0; i < args.length; ++i) {
      if (i % 2 === 0) {
        const word = args[i]
        if (word.type !== 'word')
          throw new SyntaxError(
            `First argument of (defvar) must be word but got ${word.type}`
          )
        name = word.value
      } else env[name] = evaluate(args[i], env)
    }
    return env[name]
  },
  ['setf']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError('Invalid number of arguments to (setf) (2 required)')
    const entityName = args[0].value
    const value = evaluate(args[1], env)
    for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
      if (Object.prototype.hasOwnProperty.call(scope, entityName)) {
        if (typeof scope[entityName] !== typeof value)
          throw new TypeError(
            `Invalid use of (setf), variable must be assigned to the same type (${typeof scope[
              entityName
            ]}) but attempted to assign to (${
              Array.isArray(value) ? 'Array' : typeof value
            }) (setf ${stringifyArgs(args)})`
          )
        scope[entityName] = value
        return value
      }
    throw new ReferenceError(
      `Tried setting an undefined variable: ${entityName} using (setf)`
    )
  },
  ['boole']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError(
        'Invalid number of arguments to (boole) (2 required)'
      )
    const entityName = args[0].value
    const value = evaluate(args[1], env)
    if (value !== 0 && value !== 1)
      throw new TypeError(
        `Invalid use of (boole), value must be either (or 0 1) (boole ${stringifyArgs(
          args
        )})`
      )
    for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
      if (Object.prototype.hasOwnProperty.call(scope, entityName)) {
        if (scope[entityName] !== 0 && scope[entityName] !== 1)
          throw new TypeError(
            `Invalid use of (boole), variable must be either (or 0 1) (boole ${stringifyArgs(
              args
            )})`
          )
        scope[entityName] = value
        return value
      }
    throw new ReferenceError(
      `Tried setting an undefined variable: ${entityName} using (boole)`
    )
  },
  ['import']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        'Invalid number of arguments for (import) (>= 2 required)'
      )
    const [first, ...rest] = args
    const module = evaluate(first, env)
    if (typeof module !== 'function')
      throw new TypeError(
        `First argument of (import) must be an (function) but got (${first.value}).`
      )
    const functions = rest.map((arg) => evaluate(arg, env))
    if (functions.some((arg) => typeof arg !== 'string'))
      throw new TypeError(
        'Following arguments of (import) must all be (String).'
      )
    const records = functions.reduce((a, b) => (a.add(b), a), new Set())
    module()
      .filter(([n]) => records.has(n))
      .forEach(([key, fn]) => (env[key] = fn))

    return functions
  },
  ['regex-match']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError(
        'Invalid number of arguments to (regex-match) (2 required)'
      )
    const string = evaluate(args[0], env)
    if (typeof string !== 'string')
      throw new TypeError(
        'First argument of (regex-match) has to be a (string)'
      )
    const regex = evaluate(args[1], env)
    if (typeof regex !== 'string')
      throw new TypeError(
        'Second argument of (regex-match) has to be a (string)'
      )
    const match = string.match(new RegExp(regex, 'g'))
    return match == undefined ? [] : [...match]
  },
  ['regex-replace']: (args, env) => {
    if (args.length !== 3)
      throw new RangeError(
        'Invalid number of arguments to (regex-replace) (3 required)'
      )
    const string = evaluate(args[0], env)
    if (typeof string !== 'string')
      throw new TypeError(
        'First argument of (regex-replace) has to be a (string)'
      )
    const a = evaluate(args[1], env)
    if (typeof a !== 'string')
      throw new TypeError(
        'Second argument of (regex-replace) has to be a (string)'
      )
    const b = evaluate(args[2], env)
    if (typeof b !== 'string')
      throw new TypeError(
        'Third argument of (regex-replace) has to be a (string)'
      )
    return string.replace(new RegExp(a, 'g'), b)
  },
  ['sleep']: (args, env) => {
    const time = evaluate(args[0], env)
    if (typeof time !== 'number')
      throw new TypeError(
        `First argument of (sleep) is not a (number) (sleep ${stringifyArgs(
          args
        )}).`
      )
    const callback = evaluate(args[1], env)
    if (typeof callback !== 'function')
      throw new TypeError(
        `Second argument of (sleep) is not a (number) (sleep ${stringifyArgs(
          args
        )}).`
      )
    return setTimeout(callback, time)
  },
  ['String']: (args) => {
    if (args.length)
      throw new RangeError(
        `Invalid number of arguments for (String) ${args.length}`
      )
    return ''
  },
  ['Number']: (args) => {
    if (args.length)
      throw new RangeError(
        `Invalid number of arguments for (Number) ${args.length}`
      )
    return 0
  },
  ['Boolean']: (args) => {
    if (args.length)
      throw new RangeError(
        `Invalid number of arguments for (Boolean) ${args.length}`
      )
    return 1
  },
  ['type']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError(
        `Invalid number of arguments for (type) ${args.length}`
      )
    const type = args[1]
    const value = evaluate(args[0], env)
    if (value == undefined)
      throw ReferenceError('Trying to access undefined value at (type)')
    if (type.value === 'Number') {
      const num = Number(value)
      if (isNaN(num))
        throw new TypeError(
          `Attempting to convert Not a Number ("${value}") to a Number at (type) (type ${stringifyArgs(
            args
          )}).`
        )
      return num
    } else if (type.value === 'String') return value.toString()
    else if (type.value === 'Bit') return parseInt(value, 2)
    else if (type.value === 'Boolean') return +!!value
    else if (type.value === 'Array') {
      if (typeof value[Symbol.iterator] !== 'function')
        throw new TypeError(
          `Arguments are not iterable for Array at (type) (type ${stringifyArgs(
            args
          )}).`
        )
      return [...value]
    } else
      throw new TypeError(
        `Can only cast (or number string) at (type) (type ${stringifyArgs(
          args
        )}).`
      )
  },
  ['Bit']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError('Invalid number of arguments to (Bit) (1 required).')
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
  ['go']: (args, env) => {
    if (args.length < 1)
      throw new RangeError(
        'Invalid number of arguments to (go) (>= 1 required).'
      )
    let inp = args[0]
    for (let i = 1; i < args.length; ++i) {
      if (!Array.isArray(args[i]))
        throw new TypeError(
          `Argument at position (${i}) of (go) is not a (function). (go ${stringifyArgs(
            args
          )})`
        )
      const [first, ...rest] = args[i]
      const arr = [first, inp, ...rest]
      inp = arr
    }
    return evaluate(inp, env)
  },
  ['error']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        'Invalid number of arguments to (error) (1 required).'
      )
    const string = evaluate(args[0], env)
    if (typeof string !== 'string')
      throw new TypeError(
        `First argument of (error) must be an (String) (error ${stringifyArgs(
          args
        )}).`
      )
    throw new Error(string)
  },
  ['loop']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        'Invalid number of arguments to (loop) (>= 2 required).'
      )
    // TODO: Add validation for TCO recursion
    return tokens['defun'](args.slice(1), env)
  },
  ['module']: () => 'WAT module',
}
tokens['void'] = tokens['do']
export { tokens }
