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
      if (rest.length) {
        if (typeof word !== 'function')
          throw new TypeError(`${first.value} is not a (function).`)
        return word(rest, env)
      }
      return word
    }
    case 'value':
      if (rest.length) throw new TypeError(`Values can't have arguments.`)
      return first.value
    default:
      throw new TypeError(`Trying to access a null pointer.`)
  }
}
export const run = (tree) => {
  try {
    if (Array.isArray(tree)) return tokens['block'](tree, tokens)
  } catch (err) {
    // console.log(err)
    logError(err.message)
  }
}
