const CAST_BOOLEAN_TO_NUMBER = true
const Extensions = {}
const Functions = new Map()
const Helpers = {
  log: {
    source: `var log = (msg) => { console.log(msg); return msg }`,
    has: true,
  },
  regexp_match: {
    source: `_regexp_match = (string, regex) => {
      const match = string.match(new RegExp(regex, 'g'))
      return match == undefined ? [] : [...match]
    }`,
    has: true,
  },
  regexp_replace: {
    source: `_regexp_replace = (string, a, b) => string.replace(new RegExp(a, 'g'), b)`,
    has: true,
  },
  set: {
    source: `_set = (array, index, value) => { 
      if (index < 0) {
       const target = array.length + index
       while (array.length !== target) array.pop()
      } else array[index] = value; 
      return array 
  }`,
    has: true,
  },
  error: {
    source: `_error = (error) => { 
      throw new Error(error)
  }`,
    has: true,
  },
  cast: {
    source: `_cast = (type, value) => {
      switch (type){
       case 'String':
         return value.toString()
       case 'Number':
         return Number(value)
       case 'Array':
         return [value]
       case 'Bit':
        return parseInt(value, 2)
       default:
         return 0
      }
    }`,
    has: true,
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
  const token = first.value
  if (first.type === 'apply') {
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
      case 'let': {
        let name = Arguments[0].value
        Locals.add(name)
        return `((${name}=${compile(Arguments[1], Locals)}),${name});`
      }
      case 'let*': {
        const res = compile(Arguments[1], Locals)
        const arg = Arguments[0]
        if (arg.type === 'word') return `((${arg.value}=${res}),${arg.value});`
      }
      case 'char':
        return `((${compile(Arguments[0], Locals)}).charCodeAt(${compile(
          Arguments[1],
          Locals
        )}));`
      case 'format':
        return `((${compile(Arguments[0], Locals)}).split(${compile(
          Arguments[1],
          Locals
        )}));`
      case 'regex_match':
        return `_regexp_match(${parseArgs(Arguments, Locals)});`
      case 'regex_replace':
        return `_regexp_replace(${parseArgs(Arguments, Locals)});`
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
        return Arguments.length === 2 &&
          Arguments[1].type === 'word' &&
          Arguments[1].value === 'length'
          ? `(new Array(${compile(Arguments[0], Locals)}).fill(0))`
          : `[${parseArgs(Arguments, Locals)}];`
      case "'":
        return `[${parseArgs(Arguments, Locals)}];`
      case '...':
        return `[...${parseArgs(Arguments, Locals, ',...')}];`
      case 'length':
        return `(${compile(Arguments[0], Locals)}).length`
      case 'get':
        return `${compile(Arguments[0], Locals)}.at(${compile(
          Arguments[1],
          Locals
        )});`
      case 'set':
        return `_set(${parseArgs(Arguments, Locals)});`
      case 'lambda': {
        const functionArgs = Arguments
        const body = Arguments.pop()
        const localVars = new Set()
        const evaluatedBody = compile(body, localVars)
        const vars = localVars.size ? `var ${[...localVars].join(',')};` : ''
        return `(${parseArgs(
          functionArgs.map(({ type, value }, index) =>
            value === '_' ? { type, value: `_${index}` } : { type, value }
          ),
          Locals
        )})=>{${vars} ${Array.isArray(body) ? 'return' : ' '} ${evaluatedBody
          .toString()
          .trimStart()}};`
      }
      case 'loop': {
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

        out += `${name}=(${parseArgs(functionArgs, Locals)})=>{${vars} ${
          Array.isArray(body) ? 'return' : ' '
        } ${evaluatedBody.toString().trimStart()}};`
        out += `), ${name});`
        return out
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
        out += `${name}=(${parseArgs(
          functionArgs.map(({ type, value }, index) =>
            value === '_' ? { type, value: `_${index}` } : { type, value }
          ),
          Locals
        )})=>{${vars}${Array.isArray(body) ? 'return' : ' '} ${evaluatedBody
          .toString()
          .trimStart()}};`
        out += `), ${name});`
        return out
      }
      case 'and':
        return `(${parseArgs(Arguments, Locals, '&&')});`
      case 'or':
        return `(${parseArgs(Arguments, Locals, '||')});`
      case 'concatenate':
        return '(' + parseArgs(Arguments, Locals, '+') + ');'
      case 'eq':
      case '=':
        return handleBoolean(`(${parseArgs(Arguments, Locals, '===')});`)
      case '>=':
      case '<=':
      case '>':
      case '<':
        return handleBoolean(`(${parseArgs(Arguments, Locals, token)});`)
      case '-':
        return Arguments.length === 1
          ? `(-${compile(Arguments[0], Locals)});`
          : `(${parseArgs(Arguments, Locals, token)});`
      case '+':
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
      case '/':
        return `(1/${compile(Arguments[0], Locals)});`
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
      case 'Bit':
        return `(${compile(Arguments[0], Locals)}>>>0).toString(2)`
      case '~':
        return `~${compile(Arguments[0], Locals)}`
      case 'not':
        return handleBoolean(`!${compile(Arguments[0], Locals)}`)
      case 'if': {
        return `(${compile(Arguments[0], Locals)}?${compile(
          Arguments[1],
          Locals
        )}:${Arguments.length === 3 ? compile(Arguments[2], Locals) : 0});`
      }
      case 'unless': {
        return `(${compile(Arguments[0], Locals)}?${
          Arguments.length === 3 ? compile(Arguments[2], Locals) : 0
        }:${compile(Arguments[1], Locals)});`
      }
      case 'type':
        return `_cast("${Arguments[1].value}", ${compile(
          Arguments[0],
          Locals
        )})`
      case 'do': {
        let inp = Arguments[0]
        for (let i = 1; i < Arguments.length; ++i)
          inp = [Arguments[i].shift(), inp, ...Arguments[i]]
        return compile(inp, Locals)
      }
      case 'error': {
        return `_error(${compile(Arguments[0], Locals)})`
      }
      case 'import':
        {
          const [module, ...functions] = Arguments.map((x) =>
            compile(x, Locals)
          )
          Functions.set(
            module,
            functions.map((fn) => {
              const name = fn.substring(1, fn.length - 1)
              Locals.add(name)
              return name
            })
          )
        }
        break
      default: {
        if (token in Extensions)
          return `${Extensions[token](parseArgs(Arguments, Locals))}`
        else return `${token}(${parseArgs(Arguments, Locals)});`
      }
    }
  } else if (first.type === 'value')
    return typeof first.value === 'string' ? `\`${first.value}\`` : first.value
  else if (first.type === 'word') return token
}

export const compileToJs = (AST, extensions = {}, helpers = {}, tops = []) => {
  for (const ext in extensions) Extensions[ext] = extensions[ext]
  for (const hlp in helpers) Helpers[hlp] = helpers[hlp]
  const vars = new Set()
  const raw = AST.map((x) => compile(x, vars))
    .filter(Boolean)
    .join('\n')
  let program = ''
  for (let i = 0; i < raw.length; ++i) {
    const current = raw[i]
    const next = raw[i + 1]
    if (!semiColumnEdgeCases.has(current + next)) program += current
  }
  const top = `${tops.join('\n')}${Object.values(Helpers)
    .filter((x) => x.has)
    .map((x) => x.source)
    .join(',')};\n${vars.size ? `var ${[...vars].join(',')};` : ''}`
  return { top, program, deps: [...Functions] }
}
