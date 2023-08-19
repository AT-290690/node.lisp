import { APPLY, ATOM, WORD } from './enums.js'
import { tokens } from './tokeniser.js'
const traceN = 5
const trace = (stacktrace, value) => {
  for (let i = 0; i < traceN; ++i) stacktrace[i] = stacktrace[i + 1]
  stacktrace[traceN] = value
}
export const stacktrace = Array.from({ length: traceN }).fill(null)
export const evaluate = (expression, env) => {
  if (expression == undefined) return 0
  const [first, ...rest] = Array.isArray(expression) ? expression : [expression]
  if (first == undefined) return []
  switch (first.t) {
    case WORD: {
      const word = env[first.v]
      if (word == undefined)
        throw new ReferenceError(`Undefined variable ${first.v}.`)
      return word
    }
    case APPLY:
      const apply = env[first.v]
      if (typeof apply !== 'function')
        throw new TypeError(`${first.v} is not a (function).`)
      if (!apply._count) apply._count = 0
      apply._count++
      trace(stacktrace, first.v)
      return apply(rest, env)
    case ATOM:
      if (rest.length) throw new TypeError(`Atoms can't have arguments.`)
      return first.v
    // default:
    //   console.log(types)
    //   console.log(first)
    //   throw new TypeError(`Trying to access a null pointer.`)
  }
}
export const run = (tree, env = {}) => tokens['do'](tree, { ...tokens, ...env })
