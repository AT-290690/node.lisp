import {
  handleUnbalancedParens,
  handleUnbalancedQuotes,
  removeNoCode,
} from './utils.js'
export const parse = (source) => {
  source = handleUnbalancedQuotes(handleUnbalancedParens(removeNoCode(source)))
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
        if (source[i] === '\\')
          switch (source[++i]) {
            case '\\':
              acc += '\\'
              break
            case 'n':
              acc += '\n'
              break
            case 'r':
              acc += '\r'
              break
            case 't':
              acc += '\t'
              break
            case 's':
              acc += '\\s'
              break
          }
        else acc += source[i]
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
        if (!head.length) head.push({ type: 'apply', value: token })
        else if (token.match(/^"([^"]*)"/))
          head.push({
            type: 'atom',
            value: token.substring(1, token.length - 1),
          })
        else if (token.match(/^-?[0-9]\d*(\.\d+)?$/))
          head.push({
            type: 'atom',
            value: Number(token),
          })
        else head.push({ type: 'word', value: token })
      }
      if (cursor === ')') head = stack.pop()
    } else acc += cursor
  }
  return tree
}
