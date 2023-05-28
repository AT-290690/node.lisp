import { evaluate } from './interpreter.js'
const maxCallstackLimitInterpretation = 256
export const tokens = {
  ['++']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (++), expected > 1 but got ${args.length}.`
      )
    return args.map((x) => evaluate(x, env)).reduce((a, b) => a + b, '')
  },
  ['%']: (args, env) => {
    if (args.length < 2)
      throw new RangeError(
        `Invalid number of arguments for (%), expected > 1 but got ${args.length}.`
      )
    const [a, b] = args.map((x) => evaluate(x, env))
    if (typeof a !== 'number' || typeof b !== 'number')
      throw new TypeError(`Not all arguments for (%) are numbers.`)
    return a % b
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
  ['..']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError('Invalid number of arguments for (..) (1 required)')
    const array = evaluate(args[0], env)
    if (!Array.isArray(array))
      throw new TypeError('First argument of (..) must be an ([]).')
    return array.length
  },
  ['*']: (args, env) =>
    args.map((x) => evaluate(x, env)).reduce((a, b) => a * b),
  ['-']: (args, env) =>
    args.map((x) => evaluate(x, env)).reduce((a, b) => a - b),
  ['?']: (args, env) =>
    evaluate(args[0], env) ? evaluate(args[1], env) : evaluate(args[2], env),
  ['[]']: (args, env) => {
    if (!args.length)
      throw new RangeError(
        'Invalid number of arguments for ([]) (>= 1 required)'
      )
    return args.length === 1
      ? new Array(evaluate(args[0], env)).fill(0)
      : args.map((x) => evaluate(x, env))
  },
  ['.']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError('Invalid number of arguments for (.) (2 required)')
    const array = evaluate(args[0], env)
    if (!Array.isArray(array))
      throw new TypeError('First argument of (.) must be an ([]).')
    if (array.length === 0)
      throw new RangeError(`First argument of (.) is an empty ([]).`)
    const index = evaluate(args[1], env)
    if (!Number.isInteger(index))
      throw new TypeError(
        `Second argument of (.) must be an integer (${index}).`
      )
    if (index > array.length - 1)
      throw new RangeError(
        `Second argument of (.) is outside of the ([]) bounds (${index}).`
      )
    return array.at(index)
  },
  ['.=']: (args, env) => {
    if (args.length !== 3)
      throw new RangeError('Invalid number of arguments for (.=) (3 required)')
    const array = evaluate(args[0], env)
    if (!Array.isArray(array))
      throw new TypeError(`First argument of (.=) must be an ([]).`)
    const index = evaluate(args[1], env)
    if (!Number.isInteger(index) || index < 0)
      throw new TypeError(
        `Second argument of (.=) must be a positive integer (${index}).`
      )
    if (index > array.length)
      throw new RangeError(
        `Second argument of (.=) is outside of the ([]) bounds (${index}).`
      )
    const value = evaluate(args[2], env)
    array[index] = value
    return array
  },
  ['log']: (args, env) => {
    const expressions = args.map((x) => evaluate(x, env))
    console.log(...expressions)
    return expressions.at(-1)
  },
  [':']: (args, env) => args.reduce((_, x) => evaluate(x, env), 0),
  ['->']: (args) => {
    const params = args.slice(0, -1)
    if (!params.length)
      throw new RangeError(
        'Invalid number of arguments for (->) (>= 1 required)'
      )
    const body = args.at(-1)
    return (props, env) => {
      if (props.length !== params.length)
        throw new RangeError(
          `Not all arguments for (-> ${params
            .map((x) => x.value)
            .join(' ')}) are provided.`
        )
      const localEnv = Object.create(env)
      for (let i = 0; i < props.length; ++i)
        localEnv[params[i].value] = evaluate(props[i], localEnv)
      return evaluate(body, localEnv)
    }
  },
  ['!']: (args, env) => +!evaluate(args[0], env),
  ['!=']: (args, env) => +(evaluate(args[0], env) !== evaluate(args[1], env)),
  ['==']: (args, env) => +(evaluate(args[0], env) === evaluate(args[1], env)),
  ['<']: (args, env) => +(evaluate(args[0], env) < evaluate(args[1], env)),
  ['>']: (args, env) => +(evaluate(args[0], env) > evaluate(args[1], env)),
  ['>=']: (args, env) => +(evaluate(args[0], env) >= evaluate(args[1], env)),
  ['<=']: (args, env) => +(evaluate(args[0], env) <= evaluate(args[1], env)),
  ['&&']: (args, env) => {
    for (let i = 0; i < args.length - 1; ++i)
      if (evaluate(args[i], env)) continue
      else return evaluate(args[i], env)
    return evaluate(args.at(-1), env)
  },
  ['||']: (args, env) => {
    for (let i = 0; i < args.length - 1; ++i)
      if (evaluate(args[i], env)) return evaluate(args[i], env)
      else continue
    return evaluate(args.at(-1), env)
  },
  [':=']: (args, env) => {
    if (args.length !== 2)
      throw new RangeError('Invalid number of arguments to := [2 required]')
    const value = evaluate(args[1], env)
    env[args[0].value] = value
    return value
  },
  ['=']: (args, env) => {
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
      `Tried setting an undefined variable: ${entityName} using (=)`
    )
  },
  ['~=']: (args, env) => {
    if (args.length < 2)
      throw new RangeError('Invalid number of arguments to ~= [2 required]')

    const params = args.slice(1, -1)
    if (!params.length)
      throw new RangeError(
        'Invalid number of arguments for (~=) (>= 1 required)'
      )
    const body = args.at(-1)
    const name = args[0].value
    let count = -1
    const fn = (props, env) => {
      if (count > maxCallstackLimitInterpretation)
        throw new RangeError(
          `Recursive (~=) reached maximum ${maxCallstackLimitInterpretation} calls.\n For calls (> ${maxCallstackLimitInterpretation}), compile instead.`
        )
      if (props.length !== params.length)
        throw new RangeError(
          `Not all arguments for (-> ${params
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
  ['`']: (args, env) => {
    if (args.length !== 1)
      throw new RangeError(
        `Invalid number of arguments for (\`) ${args.length}`
      )
    const value = evaluate(args[0], env)
    if (typeof value === 'string' || value == undefined) return Number(value)
    else if (typeof value === 'number') return value.toString()
    else throw new TypeError('Can only cast number or string at (`)')
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
    return operands.reduce((acc, x) => acc | x)
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
  ['|>']: (args, env) => {
    let inp = args[0]
    for (let i = 1; i < args.length; ++i)
      inp = [args[i].shift(), inp, ...args[i]]
    return evaluate(inp, env)
  },
}
