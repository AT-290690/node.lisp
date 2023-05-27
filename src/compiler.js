const CAST_BOOLEAN_TO_NUMBER = true
const helpers = {
  log: {
    source: `var log = (msg) => console.log(msg), msg`,
    has: true,
  },
  set: {
    source: `_set = (array, index, value) => { array[index] = value; return array }`,
    has: false,
  },
  cast: {
    source: `_cast = (value) => typeof value === 'number' ? String(value) : Number(value)`,
    has: false,
  },
}
const handleBoolean = (source) =>
  CAST_BOOLEAN_TO_NUMBER ? `+${source}` : source
const semiColumnEdgeCases = new Set([
  ';)',
  ';-',
  ';+',
  ';*',
  ';%',
  ';&',
  ';/',
  ';:',
  ';.',
  ';=',
  ';<',
  ';>',
  ';|',
  ';,',
  ';?',
  ',,',
  ';;',
  ';]',
])

const parse = (Arguments, Locals) => Arguments.map((x) => compile(x, Locals))
const parseArgs = (Arguments, Locals, separator = ',') =>
  parse(Arguments, Locals).join(separator)
const compile = (tree, Locals) => {
  if (!tree) return ''
  // if (Array.isArray(tree)) return tree.map((x) => compile(x, Locals)).join('\n')
  const [first, ...Arguments] = Array.isArray(tree) ? tree : [tree]
  if (first.type === 'word') {
    const token = first.value
    switch (token) {
      case ':': {
        if (Arguments.length > 1) {
          return `(${Arguments.map((x) =>
            compile(x, Locals).toString().trimStart()
          )
            .filter(Boolean)
            .join(',')});`
        } else {
          const res = compile(Arguments[0], Locals)
          return res !== undefined ? res.toString().trim() : ''
        }
      }
      case ':=': {
        let name,
          out = '(('
        for (let i = 0, len = Arguments.length; i < len; ++i) {
          const arg = Arguments[i]
          if (i % 2 === 0 && arg.type === 'word') {
            name = arg.value
            Locals.add(name)
          } else {
            out += `${name}=${compile(arg, Locals)}${i !== len - 1 ? ',' : ''}`
          }
        }
        out += `), ${name});`
        return out
      }
      case '=': {
        const res = compile(Arguments[1], Locals)
        const arg = Arguments[0]
        if (arg.type === 'word') return `((${arg.value}=${res}),${arg.value});`
      }
      case '[]':
        return Arguments.length === 1
          ? `(new Array(${compile(Arguments[0])}).fill(0))`
          : `[${parseArgs(Arguments, Locals)}];`
      case '...':
        return `[...${compile(Arguments[0], Locals)}];`
      case '..':
        return `${compile(Arguments[0], Locals)}.length`
      case '.':
        return `${compile(Arguments[0], Locals)}.at(${compile(
          Arguments[1],
          Locals
        )});`
      case '.=':
        helpers.set.has = true
        return `_set(${parseArgs(Arguments, Locals)});`
      case '->': {
        const body = Arguments.pop()
        const localVars = new Set()
        const evaluatedBody = compile(body, localVars)
        const vars = localVars.size ? `var ${[...localVars].join(',')};` : ''
        return `(${parseArgs(Arguments, Locals)}) => {${vars} ${
          Array.isArray(body) ? 'return' : ' '
        } ${evaluatedBody.toString().trimStart()}};`
      }
      case '++':
        return '(' + parseArgs(Arguments, Locals, '+') + ');'
      case '==':
        return handleBoolean(`(${parseArgs(Arguments, Locals, '===')});`)
      case '!=':
        return handleBoolean(`(${parseArgs(Arguments, Locals, '!==')});`)
      case '>=':
      case '<=':
      case '>':
      case '<':
        return handleBoolean(`(${parseArgs(Arguments, Locals, token)});`)
      case '+':
      case '-':
      case '*':
      case '&&':
      case '||':
      case '|':
      case '^':
      case '<<':
      case '>>':
      case '>>>':
      case '&':
        return `(${parseArgs(Arguments, Locals, token)});`
      case '%':
        return `(${compile(Arguments[0], Locals)}%${compile(
          Arguments[1],
          Locals
        )});`
      case '+=':
        return `(${compile(Arguments[0], Locals)}+=${
          Arguments[1] != undefined ? compile(Arguments[1], Locals) : 1
        });`
      case '-=':
        return `(${compile(Arguments[0], Locals)}-=${
          Arguments[1] != undefined ? compile(Arguments[1], Locals) : 1
        });`
      case '*=':
        return `(${compile(Arguments[0], Locals)}*=${
          Arguments[1] != undefined ? compile(Arguments[1], Locals) : 1
        });`
      case 'bit':
        return `\`\${${compile(Arguments[0], Locals) >>> 0}}\`.toString(2)`
      case '~':
        return `~${compile(Arguments[0], Locals)}`
      case '!':
        return handleBoolean(`!${compile(Arguments[0], Locals)}`)
      case '?': {
        const conditionStack = []
        Arguments.map((x) => compile(x, Locals)).forEach((x, i) =>
          i % 2 === 0
            ? conditionStack.push(x, '?')
            : conditionStack.push(x, ':')
        )
        conditionStack.pop()
        if (conditionStack.length === 3) conditionStack.push(':', 0, ';')
        return `(${conditionStack.join('')});`
      }
      case '`':
        helpers.cast.has = true
        return `_cast(${compile(Arguments[0], Locals)})`
      case '|>':
        return ''
      case 'esc': {
        const char = compile(Arguments[0], Locals)
        switch (char) {
          case '`n`':
            return '_NL'
          default:
            return '\\'
        }
      }
      default:
        undefined: {
          if (Arguments.length)
            return `${token}(${parseArgs(Arguments, Locals)});`
          else return token
        }
    }
  } else if (first.type === 'value')
    return typeof first.value === 'string' ? `\`${first.value}\`` : first.value
}

export const compileToJs = (AST) => {
  const vars = new Set()
  const raw = AST.map((x) => compile(x, vars)).join('\n')
  let program = ''
  for (let i = 0; i < raw.length; ++i) {
    const current = raw[i]
    const next = raw[i + 1]
    if (!semiColumnEdgeCases.has(current + next)) program += current
  }
  const top = `${Object.values(helpers)
    .filter((x) => x.has)
    .map((x) => x.source)
    .join(',')};\nvar _NL = "\\n";\n${
    vars.size ? `var ${[...vars].join(',')};` : ''
  }`
  return { top, program }
}
