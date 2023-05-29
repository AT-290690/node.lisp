import { handleUnbalancedParens, logError } from './utils.js'
export const parse = (source) => {
  try {
    source = handleUnbalancedParens(
      source
        .replace(/;.+/g, '')
        .replace(/[\s\s]+(?=[^"]*(?:"[^"]*"[^"]*)*$)/g, ' ')
        .trim()
    )
    const tree = []
    let head = tree,
      stack = [tree],
      acc = ''
    for (let i = 0; i < source.length; ++i) {
      const cursor = source[i]
      if (cursor === '"') {
        acc += '"'
        ++i
        while (source[i] !== '"') {
          acc += source[i]
          ++i
        }
      }
      if (cursor === '(') {
        const expression = []
        head.push(expression)
        stack.push(head)
        head = expression
      } else if (cursor === ')' || cursor === ' ') {
        let token = acc
        acc = ''
        if (token) {
          if (token.match(/^"([^"]*)"/))
            head.push({
              type: 'value',
              value: token.substring(1, token.length - 1),
            })
          else if (token.match(/^-?[0-9]\d*(\.\d+)?$/))
            head.push({
              type: 'value',
              value: Number(token),
            })
          else head.push({ type: 'word', value: token })
        }
        if (cursor === ')') head = stack.pop()
      } else acc += cursor
    }
    return tree
  } catch (err) {
    logError(err.message)
  }
}
