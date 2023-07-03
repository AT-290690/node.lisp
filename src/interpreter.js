import { tokens } from './tokeniser.js'
export const evaluate = (expression, env) => {
  if (expression == undefined) return 0
  const [first, ...rest] = Array.isArray(expression) ? expression : [expression]
  if (first == undefined) return []
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
      if (!apply.count) apply.count = 0
      apply.count++
      return apply(rest, env)
    case 'atom':
      if (rest.length) throw new TypeError(`Atoms can't have arguments.`)
      return first.value
    default:
      // console.log(first, rest[0][1])
      throw new TypeError(`Trying to access a null pointer.`)
  }
}
export const run = (tree, env = {}) =>
  tokens['block'](tree, { ...tokens, ...env })
