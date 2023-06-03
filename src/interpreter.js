import { tokens } from './tokeniser.js'
import { logError } from './utils.js'
export const evaluate = (expression, env) => {
  if (expression == undefined) return 0
  const [first, ...rest] = Array.isArray(expression) ? expression : [expression]
  if (first == undefined) throw new SyntaxError(`Undefined operator.`)
  switch (first.type) {
    case 'word': {
      const word = env[first.value]
      if (word == undefined)
        throw new TypeError(`Undefined variable ${first.value}.`)
      return word
    }
    case 'apply':
      const apply = env[first.value]
      if (typeof apply !== 'function')
        throw new TypeError(`${first.value} is not a (function).`)
      return apply(rest, env)
    case 'value':
      if (rest.length) throw new TypeError(`Values can't have arguments.`)
      return first.value
    default:
      // console.log(first, rest[0][1])
      throw new TypeError(`Trying to access a null pointer.`)
  }
}
export const run = (tree, env = {}) => {
  try {
    return tokens['block'](tree, { ...tokens, ...env })
  } catch (err) {
    // console.log(err)
    logError(err.message)
  }
}
