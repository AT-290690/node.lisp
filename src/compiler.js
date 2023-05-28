const CAST_BOOLEAN_TO_NUMBER = true
const Imports = new Set()
let Functions = []
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
  tco: {
    source: `_tco = function (fn) { return function () {
let result = fn(...arguments)
while (typeof result === 'function') result = result()
return result }}`,
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
  const [first, ...Arguments] = Array.isArray(tree) ? tree : [tree]
  if (first.type === 'word') {
    const token = first.value
    switch (token) {
      case 'block': {
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
      case 'Stringp':
        return handleBoolean(
          `(typeof(${compile(Arguments[0], Locals)})==='string');`
        )
      case 'Numberp':
        return handleBoolean(
          `(typeof(${compile(Arguments[0], Locals)})==='number');`
        )
      case 'Arrayp':
        return `(Array.isArray(${compile(Arguments[0], Locals)}));`
      case 'Array':
        return Arguments.length === 1
          ? `(new Array(${compile(Arguments[0], Locals)}).fill(0))`
          : `[${parseArgs(Arguments, Locals)}];`
      case "'":
        return `[${parseArgs(Arguments, Locals)}];`
      case '...':
        return `[...${compile(Arguments[0], Locals)}];`
      case 'length':
        return `${compile(Arguments[0], Locals)}.length`
      case 'get':
        return `${compile(Arguments[0], Locals)}.at(${compile(
          Arguments[1],
          Locals
        )});`
      case 'set':
        helpers.set.has = true
        return `_set(${parseArgs(Arguments, Locals)});`
      case 'lambda': {
        const body = Arguments.pop()
        const localVars = new Set()
        const evaluatedBody = compile(body, localVars)
        const vars = localVars.size ? `var ${[...localVars].join(',')};` : ''
        return `(${parseArgs(Arguments, Locals)})=>{${vars} ${
          Array.isArray(body) ? 'return' : ' '
        } ${evaluatedBody.toString().trimStart()}};`
      }
      case 'loop': {
        helpers.tco.has = true
        let name,
          out = '(('
        const arg = Arguments[0]
        name = arg.value
        Locals.add(name)

        const functionArgs = Arguments.slice(1)
        const body = functionArgs.pop()
        const localVars = new Set()
        const evaluatedBody = compile(body, localVars)
        const vars = localVars.size ? `var ${[...localVars].join(',')};` : ''

        out += `${name}=_tco(function ${name}(${parseArgs(
          functionArgs,
          Locals
        )}) {${vars} ${Array.isArray(body) ? 'return' : ' '} ${evaluatedBody
          .toString()
          .trimStart()}});`
        out += `), ${name});`
        return out
      }
      case 'import': {
        Arguments.map((x) => x.value).forEach((x) => Imports.add(x))
        return ''
      }
      case 'function': {
        let name,
          out = '(('
        const arg = Arguments[0]
        name = arg.value
        Locals.add(name)
        const functionArgs = Arguments.slice(1)
        const body = functionArgs.pop()
        const localVars = new Set()
        const evaluatedBody = compile(body, localVars)
        const vars = localVars.size ? `var ${[...localVars].join(',')};` : ''

        out += `${name}=(${parseArgs(functionArgs, Locals)})=>{${vars}${
          Array.isArray(body) ? 'return' : ' '
        } ${evaluatedBody.toString().trimStart()}};`
        out += `), ${name});`
        Functions.push({ name, source: out })
        return ''
      }
      case 'and':
        return `(${parseArgs(Arguments, Locals, '&&')});`
      case 'or':
        return `(${parseArgs(Arguments, Locals, '||')});`
      case '++':
        return '(' + parseArgs(Arguments, Locals, '+') + ');'
      case 'eq':
        return handleBoolean(`(${parseArgs(Arguments, Locals, '===')});`)
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
      case 'mod':
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
      case 'not':
        return handleBoolean(`!${compile(Arguments[0], Locals)}`)
      case 'if': {
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
      case 'do': {
        let inp = Arguments[0]
        for (let i = 1; i < Arguments.length; ++i)
          inp = [Arguments[i].shift(), inp, ...Arguments[i]]
        return compile(inp, Locals)
      }

      case 'esc': {
        const char = compile(Arguments[0], Locals)
        switch (char) {
          case '`n`':
            return '_NL'
          default:
            return '\\'
        }
      }
      default: {
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
  const compiled = AST.map((x) => compile(x, vars)).filter(Boolean)
  const raw = Functions.filter(({ name }) => Imports.has(name))
    .map(({ source }) => source)
    .concat(compiled)
    .join('\n')
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
