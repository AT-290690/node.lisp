import { APPLY, ATOM, TYPE, VALUE, WORD, TYPES } from './enums.js'
import { evaluate } from './interpreter.js'
const stringifyType = (type) =>
  Array.isArray(type)
    ? `(array ${type.map((t) => stringifyType(t)).join(' ')})`
    : typeof type
const stringifyArgs = (args) =>
  args
    .map((x) => {
      return Array.isArray(x)
        ? `(${stringifyArgs(x)})`
        : x[TYPE] === [APPLY] || x[TYPE] === WORD
        ? x[VALUE]
        : JSON.stringify(x[VALUE])
            .replace(new RegExp(/\[/g), '(')
            .replace(new RegExp(/\]/g), ')')
            .replace(new RegExp(/\,/g), ' ')
            .replace(new RegExp(/"/g), '')
    })
    .join(' ')
const atom = (arg, env) => {
  if (arg[TYPE] === ATOM) return 1
  else {
    const atom = evaluate(arg, env)
    return +(
      typeof atom === 'number' ||
      typeof atom === 'bigint' ||
      typeof atom === 'string'
    )
  }
}
const equal = (a, b) =>
  (typeof a !== 'object' && typeof b !== 'object' && typeof a === typeof b) ||
  (Array.isArray(a) &&
    Array.isArray(b) &&
    (!a.length ||
      !b.length ||
      !(a.length > b.length ? a : b).some(
        (_, i, bigger) =>
          !equal(
            bigger.at(i),
            (a.length > b.length ? b : a).at(
              i % (a.length > b.length ? b : a).length
            )
          )
      ))) ||
  false
const partial = (a, b) =>
  (typeof a !== 'object' && typeof b !== 'object' && typeof a === typeof b) ||
  (Array.isArray(a) &&
    Array.isArray(b) &&
    (!a.length ||
      !b.length ||
      !(a.length < b.length ? a : b).some(
        (_, i, smaller) =>
          !equal(
            smaller.at(i),
            (a.length < b.length ? b : a).at(
              i % (a.length < b.length ? b : a).length
            )
          )
      ))) ||
  false
const tokens = {
  ['Lambda']: (args, env) => args.map((x) => evaluate(x, env)),
  ['Or']: (args, env) => {
    const out = args.map((x) => evaluate(x, env))
    out._type = 'Or'
    return out
  },
  ['And']: (args, env) => {
    const out = args.map((x) => evaluate(x, env))
    out._type = 'And'
    return out
  },
  ['deftype']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments to (deftype) (2 required) (deftype ${stringifyArgs(
          args
        )})`
      )
    if (args.length !== 2)
      throw new RangeError(
        `Invalid number of arguments to (deftype) (2 required) (deftype ${stringifyArgs(
          args
        )})`
      )

    const word = args[0]
    if (word[TYPE] !== WORD)
      throw new SyntaxError(
        `First argument of (deftype) must be word but got ${
          word[TYPE]
        } (deftype ${stringifyArgs(args)})`
      )
    const name = word[VALUE]
    const T = args[1]
    if (!env[TYPES]) env[TYPES] = {}
    env[TYPES][name] = evaluate(T, env)
    return env[TYPES][name]
  },
  ['identity']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (identity), expected 1 but got ${
          args.length
        }. (identity ${stringifyArgs(args)})`
      )
    return evaluate(args[0], env)
  },

  ['concatenate']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (concatenate), expected > 1 but got ${
          args.length
        }. (concatenate ${stringifyArgs(args)}).`
      )
    const operands = args.map((x) => evaluate(x, env))
    if (operands.some((x) => typeof x !== 'string'))
      throw new TypeError(
        `Not all arguments of (concatenate) are (Strings) (concatenate ${stringifyArgs(
          args
        )}).`
      )
    return operands.reduce((a, b) => a + b, '')
  },
  ['mod']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (mod), expected > 1 but got ${
          args.length
        }. (mod ${stringifyArgs(args)}).`
      )
    const [a, b] = args.map((x) => evaluate(x, env))
    if (typeof a !== 'number' || typeof b !== 'number')
      throw new TypeError(
        `Not all arguments of (mod) are (Numbers) (mod ${stringifyArgs(args)}).`
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
        `Invalid number of arguments for (/), expected 1 but got ${
          args.length
        }. (/ ${stringifyArgs(args)}).`
      )
    const number = evaluate(args[0], env)
    if (typeof number !== 'number')
      throw new TypeError(
        `Arguments of (/) is not a (Number) (/ ${stringifyArgs(args)}).`
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
        `Invalid number of arguments for (length) (1 required) (length ${stringifyArgs(
          args
        )}).`
      )
    const array = evaluate(args[0], env)
    if (!(Array.isArray(array) || typeof array === 'string'))
      throw new TypeError(
        `First argument of (length) must be an (Array | String) (length ${stringifyArgs(
          args
        )}).`
      )
    return array.length
  },
  ['Arrayp']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (Arrayp) (1 required) (Arrayp ${stringifyArgs(
          args
        )}).`
      )
    const array = evaluate(args[0], env)
    return +Array.isArray(array)
  },
  ['Numberp']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (Numberp) (1 required) (Numberp ${stringifyArgs(
          args
        )}).`
      )
    return +(typeof evaluate(args[0], env) === 'number')
  },
  ['Integerp']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (Integerp) (1 required) (Integerp ${stringifyArgs(
          args
        )}).`
      )
    return +(typeof evaluate(args[0], env) === 'bigint')
  },
  ['Stringp']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (Stringp) (1 required) (Stringp ${stringifyArgs(
          args
        )}).`
      )
    return +(typeof evaluate(args[0], env) === 'string')
  },
  ['Functionp']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (Functionp) (1 required) (Functionp ${stringifyArgs(
          args
        )}).`
      )
    return +(typeof evaluate(args[0], env) === 'function')
  },
  ['char-code']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError(
        `Invalid number of arguments for (char-code) (2 required) (char-code ${stringifyArgs(
          args
        )}).`
      )
    const string = evaluate(args[0], env)
    if (typeof string !== 'string')
      throw new TypeError(
        `First argument of (char-code) must be an (String) (char-code ${stringifyArgs(
          args
        )}).`
      )
    const index = evaluate(args[1], env)
    if (!Number.isInteger(index) || index < 0)
      throw new TypeError(
        `Second argument of (char-code) must be an (+ Integer) (char-code ${stringifyArgs(
          args
        )}).`
      )
    return string.charCodeAt(index)
  },
  ['char']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (char) (= 1 required) (char ${stringifyArgs(
          args
        )}).`
      )
    const index = evaluate(args[0], env)
    if (!Number.isInteger(index) || index < 0)
      throw new TypeError(
        `Arguments of (char) must be (+ Integer) (char ${stringifyArgs(args)}).`
      )
    return String.fromCharCode(index)
  },
  ['make-string']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (make-string) (= 1 required) (make-string ${stringifyArgs(
          args
        )}).`
      )
    const indexes = evaluate(args[0], env)
    if (indexes.some((index) => !Number.isInteger(index) || index < 0))
      throw new TypeError(
        `Arguments of (make-string) must be (+ Integers) (make-string ${stringifyArgs(
          args
        )}).`
      )
    return String.fromCharCode(...indexes)
  },
  ['+']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (+), expected > 1 but got ${
          args.length
        }. (+ ${stringifyArgs(args)}).`
      )
    const operands = args.map((x) => evaluate(x, env))
    if (operands.some((x) => typeof x !== 'number' && typeof x !== 'bigint'))
      throw new TypeError(
        `Not all arguments of (+) are (Numbers) (+ ${stringifyArgs(args)}).`
      )
    return operands.reduce((a, b) => a + b)
  },
  ['*']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (*), expected > 1 but got ${args.length}.`
      )
    const operands = args.map((x) => evaluate(x, env))
    if (operands.some((x) => typeof x !== 'number' && typeof x !== 'bigint'))
      throw new TypeError(
        `Not all arguments of (*) are (Numbers) (* ${stringifyArgs(args)}).`
      )
    return operands.reduce((a, b) => a * b)
  },
  ['-']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        `Invalid number of arguments for (-), expected >= 1 but got ${
          args.length
        }. (- ${stringifyArgs(args)}).`
      )
    const operands = args.map((x) => evaluate(x, env))
    if (operands.some((x) => typeof x !== 'number' && typeof x !== 'bigint'))
      throw new TypeError(
        `Not all arguments of (-) are (Numbers) (- ${stringifyArgs(args)}).`
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
  ['when']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError(
        `Invalid number of arguments for (when), expected 2 but got ${
          args.length
        } (when ${stringifyArgs(args)}).`
      )
    if (evaluate(args[0], env)) return evaluate(args[1], env)
    return 0
  },
  ['otherwise']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError(
        `Invalid number of arguments for (otherwise), expected 2 but got ${
          args.length
        } (otherwise ${stringifyArgs(args)}).`
      )
    if (evaluate(args[0], env)) return 0
    return evaluate(args[1], env)
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
    if (!args.length) return []
    const isCapacity =
      args.length === 2 && args[1][TYPE] === WORD && args[1][VALUE] === 'length'
    if (isCapacity) {
      if (args.length !== 2)
        throw new RangeError(
          `Invalid number of arguments for (Array) (= 2 required) (Array ${stringifyArgs(
            args
          )})`
        )
      const N = evaluate(args[0], env)
      if (!Number.isInteger(N))
        throw new TypeError(
          `Size argument for (Array) has to be an (32 bit integer) (Array ${stringifyArgs(
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
        `Invalid number of arguments for (Atomp) (1 required) (atom ${stringifyArgs(
          args
        )}).`
      )
    return atom(args[0], env)
  },
  ['car']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (car) (1 required) (car ${stringifyArgs(
          args
        )}).`
      )
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
      throw new RangeError(
        `Invalid number of arguments for (cdr) (1 required) (cdr ${stringifyArgs(
          args
        )})`
      )
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
      throw new RangeError(
        `Invalid number of arguments for (get) (2 required) (get ${stringifyArgs(
          args
        )})`
      )
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
        `Second argument of (get) must be an (32 bit integer) (${index}) (get ${stringifyArgs(
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
        `Invalid number of arguments for (set) (or 2 3) required (set ${stringifyArgs(
          args
        )})`
      )
    const array = evaluate(args[0], env)
    if (!Array.isArray(array))
      throw new TypeError(
        `First argument of (set) must be an (Array) but got (${array}) (set ${stringifyArgs(
          args
        )}).`
      )
    const index = evaluate(args[1], env)
    if (!Number.isInteger(index))
      throw new TypeError(
        `Second argument of (set) must be an (32 bit integer) (${index}) (set ${stringifyArgs(
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
          `Invalid number of arguments for (set) (if (< index 0) then 2 required) (set ${stringifyArgs(
            args
          )})`
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
          `Invalid number of arguments for (set) (if (>= index 0) then 3 required) (set ${stringifyArgs(
            args
          )})`
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
      if (current._count) {
        total += current._count
        out[item] = current._count
      }
    }
    return [Object.entries(out), ['⏱️ ', total]]
  },
  ['log']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        `Invalid number of arguments to (log) (>= 1 required) (log ${stringifyArgs(
          args
        )})`
      )
    const expressions = args.map((x) => evaluate(x, env))
    console.log(...expressions)
    return expressions.at(-1)
  },
  ['do']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        `Invalid number of arguments to (do) (>= 1 required) (do ${stringifyArgs(
          args
        )})`
      )
    return args.reduce((_, x) => evaluate(x, env), 0)
  },
  ['defun']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments to (defun) (2 required) (defun ${stringifyArgs(
          args
        )})`
      )
    const params = args.slice(1, -1)
    const body = args.at(-1)
    const name = args[0][VALUE]
    const fn = (props = [], scope) => {
      if (props.length > params.length) {
        throw new RangeError(
          `More arguments for (defun ${name} ${params
            .map((x) => x[VALUE])
            .join(' ')
            .trim()}) are provided. (expects ${params.length} but got ${
            props.length
          })`
        )
      }
      if (props.length !== params.length)
        throw new RangeError(
          `Incorrect number of arguments for (defun ${name} ${params
            .map((x) => x[VALUE])
            .join(' ')
            .trim()}) are provided. (expects ${params.length} but got ${
            props.length
          }) (defun ${stringifyArgs(args)})`
        )

      const localEnv = Object.create(env)
      const isTyped = env[TYPES] && name in env[TYPES]
      if (isTyped && props.length !== env[TYPES][name].length - 1)
        throw new RangeError(
          `The number of arguments doesn't match type of ${name}\n(defun ${stringifyArgs(
            args
          )})\n should be ${env[TYPES][name].length - 1}`
        )
      for (let i = 0; i < props.length; ++i) {
        const value = evaluate(props[i], scope)
        const param = params[i][VALUE]
        if (isTyped) {
          const Type = env[TYPES][name].slice(0, -1)
          if (Type[i]._type === 'Or' && !Type[i].some((T) => equal(value, T)))
            throw new TypeError(
              `Type doesn't match ${i} argument (${param}) of ${name}\n(defun ${stringifyArgs(
                args
              )})\nShould be:\n${Type[i]
                .map((T) => stringifyType(T))
                .join('\nor\n')}`
            )
          else if (
            Type[i]._type === 'And' &&
            Type[i].length &&
            !Type[i].some((T) => partial(value, T))
          ) {
            throw new TypeError(
              `Type doesn't match ${i} argument (${param}) of ${name}\n(defun ${stringifyArgs(
                args
              )})\nShould be:\n${Type[i]
                .map((T) => stringifyType(T))
                .join('\nand\n')}`
            )
          }
        }
        Object.defineProperty(localEnv, param, {
          value,
          writable: true,
        })
      }
      const result = evaluate(body, localEnv)
      if (isTyped) {
        const Type = env[TYPES][name].at(-1)
        if (Type._type === 'Or' && !Type.some((T) => equal(result, T)))
          throw new TypeError(
            `Type doesn't match result of ${name}\n(defun ${stringifyArgs(
              args
            )})\nShould be:\n${Type.map((T) => stringifyType(T)).join(
              '\nor\n'
            )}`
          )
        else if (
          Type._type === 'And' &&
          Type.length &&
          !Type.some((T) => partial(result, T))
        ) {
          throw new TypeError(
            `Type doesn't match result of ${name}\n(defun ${stringifyArgs(
              args
            )})\nShould be:\n${Type.map((T) => stringifyType(T)).join(
              '\nand\n'
            )}`
          )
        }
      }
      return result
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
            .map((x) => x[VALUE])
            .join(' ')}) are provided. (expects ${params.length} but got ${
            props.length
          }) (lambda ${stringifyArgs(args)})`
        )
      const localEnv = Object.create(env)
      for (let i = 0; i < props.length; ++i)
        localEnv[params[i][VALUE]] = evaluate(props[i], scope)
      return evaluate(body, localEnv)
    }
  },
  ['not']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (not) (1 required) (not ${stringifyArgs(
          args
        )})`
      )
    return +!evaluate(args[0], env)
  },
  ['=']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError(
        `Invalid number of arguments for (=) (2 required) (= ${stringifyArgs(
          args
        )})`
      )
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
      throw new RangeError(
        `Invalid number of arguments for (<) (2 required) (< ${stringifyArgs(
          args
        )})`
      )
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
      throw new RangeError(
        `Invalid number of arguments for (>) (2 required) (> ${stringifyArgs(
          args
        )})`
      )
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
      throw new RangeError(
        `Invalid number of arguments for (>=) (2 required) (>= ${stringifyArgs(
          args
        )})`
      )
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
      throw new RangeError(
        `Invalid number of arguments for (<=) (2 required) (<= ${stringifyArgs(
          args
        )})`
      )
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
        `Invalid number of arguments for (and) (>= 2 required) (and ${stringifyArgs(
          args
        )})`
      )
    let circuit
    for (let i = 0; i < args.length - 1; ++i) {
      circuit = evaluate(args[i], env)
      if (circuit) continue
      else return circuit
    }
    return evaluate(args.at(-1), env)
  },
  ['or']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (or) (>= 2 required) (or ${stringifyArgs(
          args
        )})`
      )
    let circuit
    for (let i = 0; i < args.length - 1; ++i) {
      circuit = evaluate(args[i], env)
      if (circuit) return circuit
      else continue
    }
    return evaluate(args.at(-1), env)
  },
  ['apply']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        `Invalid number of arguments to (apply) (>= 1 required) (apply ${stringifyArgs(
          args
        )})`
      )
    const [first, ...rest] = args
    if (first[TYPE] === WORD && first[VALUE] in tokens)
      throw new TypeError(
        `Following argument of (apply) must not be an reserved word (apply ${stringifyArgs(
          args
        )})`
      )
    const apply = evaluate(first, env)
    if (typeof apply !== 'function')
      throw new TypeError(
        `First argument of (apply) must be a (lambda) (apply ${stringifyArgs(
          args
        )})`
      )

    return apply(rest, env)
  },
  ['defconstant']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments to (defconstant) (> 2 required) (defconstant ${stringifyArgs(
          args
        )})`
      )
    if (args.length % 2 === 1)
      throw new RangeError(
        `Invalid number of arguments to (defconstant) (pairs of 2 required) (defconstant ${stringifyArgs(
          args
        )})`
      )
    let name
    for (let i = 0; i < args.length; ++i) {
      if (i % 2 === 0) {
        const word = args[i]
        if (word[TYPE] !== WORD)
          throw new SyntaxError(
            `First argument of (defconstant) must be word but got ${
              word[TYPE]
            } (defconstant ${stringifyArgs(args)})`
          )
        name = word[VALUE]
      } else
        Object.defineProperty(env, name, {
          value: evaluate(args[i], env),
          writable: false,
        })
    }
    return env[name]
  },
  ['defvar']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments to (defvar) (> 2 required) (defvar ${stringifyArgs(
          args
        )})`
      )
    if (args.length % 2 === 1)
      throw new RangeError(
        `Invalid number of arguments to (defvar) (pairs of 2 required) (defvar ${stringifyArgs(
          args
        )})`
      )
    let name
    for (let i = 0; i < args.length; ++i) {
      if (i % 2 === 0) {
        const word = args[i]
        if (word[TYPE] !== WORD)
          throw new SyntaxError(
            `First argument of (defvar) must be word but got ${
              word[TYPE]
            } (defvar ${stringifyArgs(args)})`
          )
        name = word[VALUE]
      } else env[name] = evaluate(args[i], env)
    }
    return env[name]
  },
  ['setf']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError(
        `Invalid number of arguments to (setf) (2 required) (setf ${stringifyArgs(
          args
        )})`
      )
    const entityName = args[0][VALUE]
    const value = evaluate(args[1], env)
    for (let scope = env; scope; scope = Object.getPrototypeOf(scope))
      if (Object.prototype.hasOwnProperty.call(scope, entityName)) {
        if (typeof scope[entityName] !== typeof value)
          throw new TypeError(
            `Invalid use of (setf), variable must be assigned to the same type (${
              Array.isArray(scope[entityName])
                ? `array`
                : `${typeof scope[entityName]}`
            }) but attempted to assign to (${
              Array.isArray(value) ? 'array' : typeof value
            }) (setf ${stringifyArgs(args)})`
          )
        scope[entityName] = value
        return value
      }
    throw new ReferenceError(
      `Tried setting an undefined variable: ${entityName} using (setf) (setf ${stringifyArgs(
        args
      )})`
    )
  },
  ['boole']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError(
        `Invalid number of arguments to (boole) (2 required) (boole ${stringifyArgs(
          args
        )})`
      )
    const entityName = args[0][VALUE]
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
      `Tried setting an undefined variable: ${entityName} using (boole) (boole ${stringifyArgs(
        args
      )})`
    )
  },
  ['import']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (import) (>= 2 required) (import ${stringifyArgs(
          args
        )})`
      )
    const [first, ...rest] = args
    const module = evaluate(first, env)
    if (typeof module !== 'function')
      throw new TypeError(
        `First argument of (import) must be an (function) but got (${
          first[VALUE]
        }). (import ${stringifyArgs(args)})`
      )
    const functions = rest.map((arg) => evaluate(arg, env))
    if (functions.some((arg) => typeof arg !== 'string'))
      throw new TypeError(
        `Following arguments of (import) must all be (String). (import ${stringifyArgs(
          args
        )})`
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
        `Invalid number of arguments to (regex-match) (2 required) (regex-match ${stringifyArgs(
          args
        )})`
      )
    const string = evaluate(args[0], env)
    if (typeof string !== 'string')
      throw new TypeError(
        `First argument of (regex-match) has to be a (String) (regex-match ${stringifyArgs(
          args
        )})`
      )
    const regex = evaluate(args[1], env)
    if (typeof regex !== 'string')
      throw new TypeError(
        `Second argument of (regex-match) has to be a (String) (regex-match ${stringifyArgs(
          args
        )})`
      )
    const match = string.match(new RegExp(regex, 'g'))
    return match == undefined ? [] : [...match]
  },
  ['regex-replace']: (args, env) => {
    if (args.length !== 3)
      throw new RangeError(
        `Invalid number of arguments to (regex-replace) (3 required) (regex-replace ${stringifyArgs(
          args
        )})`
      )
    const string = evaluate(args[0], env)
    if (typeof string !== 'string')
      throw new TypeError(
        `First argument of (regex-replace) has to be a (String) (regex-replace ${stringifyArgs(
          args
        )})`
      )
    const a = evaluate(args[1], env)
    if (typeof a !== 'string')
      throw new TypeError(
        `Second argument of (regex-replace) has to be a (String) (regex-replace ${stringifyArgs(
          args
        )})`
      )
    const b = evaluate(args[2], env)
    if (typeof b !== 'string')
      throw new TypeError(
        `Third argument of (regex-replace) has to be a (String) (regex-replace ${stringifyArgs(
          args
        )})`
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
  ['String']: () => '',
  ['Number']: () => 0,
  ['Integer']: () => 0n,
  ['Boolean']: () => 1,
  ['Function']: () => () => {},
  ['type']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError(
        `Invalid number of arguments for (type) ${args.length}`
      )
    const type = args[1][VALUE]
    const value = evaluate(args[0], env)
    if (value == undefined)
      throw ReferenceError('Trying to access undefined value at (type)')
    if (args.length === 2) {
      switch (type) {
        case 'Number': {
          const num = Number(value)
          if (isNaN(num))
            throw new TypeError(
              `Attempting to convert Not a Number ("${value}") to a Number at (type) (type ${stringifyArgs(
                args
              )}).`
            )
          return num
        }
        case 'Integer':
          return BigInt(value)
        case 'String':
          return value.toString()
        case 'Bit':
          return parseInt(value, 2)
        case 'Boolean':
          return +!!value
        case 'Function':
          return () => value
        case 'Array': {
          if (typeof value === 'number' || typeof value === 'bigint')
            return [...Number(value).toString()].map(Number)
          else if (typeof value[Symbol.iterator] !== 'function')
            throw new TypeError(
              `Arguments are not iterable for Array at (type) (type ${stringifyArgs(
                args
              )}).`
            )
          return [...value]
        }
        default:
          throw new TypeError(
            `Can only cast (or Number Integer String Array Bit Boolean) at (type) (type ${stringifyArgs(
              args
            )}).`
          )
      }
    }
  },
  ['Bit']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments to (Bit) (1 required). (Bit ${stringifyArgs(
          args
        )})`
      )
    const operand = evaluate(args[0], env)
    if (typeof operand !== 'number' && typeof operand !== 'bigint')
      throw new TypeError(
        `Argument of (Bit) is not a (Number) (Bit ${stringifyArgs(args)}).`
      )
    return (operand >>> 0).toString(2)
  },
  ['&']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments to (&) (>= 2 required). (& ${stringifyArgs(
          args
        )})`
      )
    const operands = args.map((a) => evaluate(a, env))
    if (operands.some((x) => typeof x !== 'number' && typeof x !== 'bigint'))
      throw new TypeError(
        `Not all arguments of (&) are (Numbers) (& ${stringifyArgs(args)}).`
      )
    return operands.reduce((acc, x) => acc & x)
  },
  ['~']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments to (~) (1 required). (~ ${stringifyArgs(
          args
        )})`
      )
    const operand = evaluate(args[0], env)
    if (typeof operand !== 'number' && typeof operand !== 'bigint')
      throw new TypeError(
        `Argument of (~) is not a (Number) (~ ${stringifyArgs(args)}).`
      )
    return ~operand
  },
  ['|']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments to (|) (>= 2 required). (| ${stringifyArgs(
          args
        )})`
      )
    const operands = args.map((a) => evaluate(a, env))
    if (operands.some((x) => typeof x !== 'number' && typeof x !== 'bigint'))
      throw new TypeError(
        `Not all arguments of (|) are (Numbers) (| ${stringifyArgs(args)}).`
      )
    return operands.reduce((acc, x) => acc | x)
  },
  ['^']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments to (^) (>= 2 required). (^ ${stringifyArgs(
          args
        )}).`
      )
    const operands = args.map((a) => evaluate(a, env))
    if (operands.some((x) => typeof x !== 'number' && typeof x !== 'bigint'))
      throw new TypeError(
        `Not all arguments of (^) are (Numbers) (^ ${stringifyArgs(args)}).`
      )
    return operands.reduce((acc, x) => acc ^ x)
  },
  ['<<']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments to (<<) (>= 2 required). (<< ${stringifyArgs(
          args
        )}).`
      )
    const operands = args.map((a) => evaluate(a, env))
    if (operands.some((x) => typeof x !== 'number' && typeof x !== 'bigint'))
      throw new TypeError(
        `Not all arguments of (<<) are (Numbers) (<< ${stringifyArgs(args)}).`
      )
    return operands.reduce((acc, x) => acc << x)
  },
  ['>>']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments to (>>) (>= 2 required). (>> ${stringifyArgs(
          args
        )}).`
      )
    const operands = args.map((a) => evaluate(a, env))
    if (operands.some((x) => typeof x !== 'number' && typeof x !== 'bigint'))
      throw new TypeError(
        `Not all arguments of (>>) are (Numbers) (>> ${stringifyArgs(args)}).`
      )
    return operands.reduce((acc, x) => acc >> x)
  },
  ['>>>']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments to (>>>) (>= 2 required). (>>> ${stringifyArgs(
          args
        )}).`
      )
    const operands = args.map((a) => evaluate(a, env))
    if (operands.some((x) => typeof x !== 'number' && typeof x !== 'bigint'))
      throw new TypeError(
        `Not all arguments of (>>>) are (Numbers) (>>> ${stringifyArgs(args)}).`
      )
    return operands.reduce((acc, x) => acc >>> x)
  },
  ['go']: (args, env) => {
    if (args.length < 1)
      throw new RangeError(
        `Invalid number of arguments to (go) (>= 1 required). (go ${stringifyArgs(
          args
        )})`
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
  ['throw']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments to (error) (1 required). (throw ${stringifyArgs(
          args
        )}).`
      )
    const string = evaluate(args[0], env)
    if (typeof string !== 'string')
      throw new TypeError(
        `First argument of (error) must be an (String) (throw ${stringifyArgs(
          args
        )}).`
      )
    throw new Error(string)
  },
  ['loop']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        `Invalid number of arguments to (loop) (>= 2 required). (loop ${stringifyArgs(
          args
        )}).`
      )
    // TODO: Add validation for TCO recursion
    const [definition, ...functionArgs] = args
    return tokens[definition[VALUE]](functionArgs, env)
  },
  ['module']: () => 'WAT module',
}
tokens['void'] = tokens['do']
export { tokens }
