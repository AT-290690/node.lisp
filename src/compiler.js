export const earMuffsToLodashes = (name) => name.replace(new RegExp(/\*/g), '_')
export const dotNamesToLowerCase = (name) => name.replace(new RegExp(/\./g), '')
export const toCamelCase = (name) => {
  let out = name[0]
  for (let i = 1; i < name.length; ++i) {
    const current = name[i],
      prev = name[i - 1]
    if (current === '-') continue
    else if (prev === '-') {
      out += current.toUpperCase()
    } else out += current
  }
  return out
}
export const deepRename = (name, newName, tree) => {
  if (Array.isArray(tree))
    for (const branch of tree) {
      if (branch.value === name) branch.value = `()=>${newName}`
      deepRename(name, newName, branch)
    }
}
export const lispToJavaScriptVariableName = (name) =>
  toCamelCase(dotNamesToLowerCase(earMuffsToLodashes(name)))
const CAST_BOOLEAN_TO_NUMBER = true
const Extensions = {}
const Functions = new Map()
const Helpers = {
  log: {
    source: `var log = (msg) => { console.log(msg); return msg }`,
    has: true,
  },
  tco: {
    source: `tco = fn => (...args) => {
      let result = fn(...args)
      while (typeof result === 'function') result = result()
      return result
    }`,
    has: true,
  },
  'regexp-match': {
    source: `_regExpMatch = (string, regex) => {
      const match = string.match(new RegExp(regex, 'g'))
      return match == undefined ? [] : [...match]
    }`,
    has: true,
  },
  'regexp-replace': {
    source: `_regExpReplace = (string, a, b) => string.replace(new RegExp(a, 'g'), b)`,
    has: true,
  },
  atom: {
    source: `_isAtom = (value) => typeof value === 'number' ||  typeof value === 'bigint' || typeof value === 'string'`,
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
    switch (type) {
      case 'Number':
         return Number(value)
      case 'Integer':
         return BigInt(value)
      case 'String':
         return value.toString()
      case 'Array':
         return [...value]
      case 'Bit':
         return parseInt(value, 2)
      case 'Boolean':
          return +!!value
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
  if (first == undefined) return '[];'
  const token = first.value
  if (first.type === 'apply') {
    switch (token) {
      case 'do': {
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
      case 'apply': {
        const [first, ...rest] = Arguments
        const apply = compile(first, Locals)
        return `${
          apply[apply.length - 1] === ';'
            ? apply.substring(0, apply.length - 1)
            : apply
        }(${parseArgs(rest, Locals)})`
      }
      case 'defvar':
      case 'let': {
        let name,
          out = '(('
        for (let i = 0, len = Arguments.length; i < len; ++i) {
          const arg = Arguments[i]
          if (i % 2 === 0 && arg.type === 'word') {
            name = lispToJavaScriptVariableName(arg.value)
            Locals.add(name)
          } else
            out += `${name}=${compile(arg, Locals)}${i !== len - 1 ? ',' : ''}`
        }
        out += `),${name});`
        return out
      }
      case 'setf':
      case 'let*':
      case 'boole': {
        const res = compile(Arguments[1], Locals)
        const arg = Arguments[0]
        if (arg.type === 'word') {
          const name = lispToJavaScriptVariableName(arg.value)
          return `((${name}=${res}),${name});`
        }
        return ''
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
      case 'regex-match':
        return `_regExpMatch(${parseArgs(Arguments, Locals)});`
      case 'regex-replace':
        return `_regExpReplace(${parseArgs(Arguments, Locals)});`
      case 'Stringp':
        return handleBoolean(
          `(typeof(${compile(Arguments[0], Locals)})==='string');`
        )
      case 'Numberp':
        return handleBoolean(
          `(typeof(${compile(Arguments[0], Locals)})==='number');`
        )
      case 'Integerp':
        return handleBoolean(
          `(typeof(${compile(Arguments[0], Locals)})==='bigint');`
        )
      case 'Arrayp':
        return `(Array.isArray(${compile(Arguments[0], Locals)}));`
      case 'Number':
        return '0'
      case 'Boolean':
        return '1'
      case 'String':
        return ''
      case 'Array':
        return Arguments.length === 2 &&
          Arguments[1].type === 'word' &&
          Arguments[1].value === 'length'
          ? `(new Array(${compile(Arguments[0], Locals)}).fill(0))`
          : `[${parseArgs(Arguments, Locals)}];`
      case 'length':
        return `(${compile(Arguments[0], Locals)}).length`
      case 'atom':
        return handleBoolean(`_isAtom(${compile(Arguments[0], Locals)});`)
      case 'car':
        return `${compile(Arguments[0], Locals)}.at(0);`
      case 'cdr':
        return `${compile(Arguments[0], Locals)}.slice(1);`
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
        return `((${parseArgs(
          functionArgs.map(({ type, value }, index) =>
            value === '.' ? { type, value: `_${index}` } : { type, value }
          ),
          Locals
        )})=>{${vars}return ${evaluatedBody.toString().trimStart()}});`
      }
      case 'loop': {
        let name,
          newName,
          out = '(('
        const arg = Arguments[1]
        name = lispToJavaScriptVariableName(arg.value)
        newName = `rec_${performance.now().toString().replace('.', 7)}`
        Locals.add(name)
        Locals.add(newName)
        const functionArgs = Arguments.slice(2)
        const body = functionArgs.pop()
        const localVars = new Set()
        deepRename(arg.value, newName, body)
        const evaluatedBody = compile(body, localVars)
        const vars = localVars.size ? `var ${[...localVars].join(',')};` : ''
        out += `${name}=(tco(${newName}=(${parseArgs(
          functionArgs,
          Locals
        )})=>{${vars}return ${evaluatedBody.toString().trimStart()}};`
        out += `, ${newName}))), ${name});`
        return out
      }
      case 'defun': {
        let name,
          out = '(('
        const arg = Arguments[0]
        name = lispToJavaScriptVariableName(arg.value)
        Locals.add(name)
        const functionArgs = Arguments.slice(1)
        const body = functionArgs.pop()
        const localVars = new Set()
        const evaluatedBody = compile(body, localVars)
        const vars = localVars.size ? `var ${[...localVars].join(',')};` : ''
        out += `${name}=(${parseArgs(
          functionArgs.map(({ type, value }, index) =>
            value === '.' ? { type, value: `_${index}` } : { type, value }
          ),
          Locals
        )})=>{${vars}return ${evaluatedBody.toString().trimStart()}};`
        out += `),${name});`
        return out
      }
      case 'and':
        return `(${parseArgs(Arguments, Locals, '&&')});`
      case 'or':
        return `((${parseArgs(Arguments, Locals, '||')}) || 0);`
      case 'concatenate':
        return '(' + parseArgs(Arguments, Locals, '+') + ');'
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
      case 'cond': {
        let out = '('
        for (let i = 0; i < Arguments.length; i += 2)
          out += `${compile(Arguments[i], Locals)}?${compile(
            Arguments[i + 1],
            Locals
          )}:`
        out += '0);'
        return out
      }
      case 'type':
        return `_cast("${Arguments[1].value}", ${compile(
          Arguments[0],
          Locals
        )})`
      case 'go': {
        let inp = Arguments[0]
        for (let i = 1; i < Arguments.length; ++i)
          inp = [Arguments[i].shift(), inp, ...Arguments[i]]
        return compile(inp, Locals)
      }
      case 'sleep': {
        return `setTimeout(${compile(Arguments[1], Locals)},${compile(
          Arguments[0],
          Locals
        )});`
      }
      case 'throw': {
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
              const name = lispToJavaScriptVariableName(
                fn.substring(1, fn.length - 1)
              )
              Locals.add(name)
              return name
            })
          )
        }
        break
      case 'probe-file':
      case 'void':
        return ''
      default: {
        const camleCasedToken = lispToJavaScriptVariableName(token)
        if (camleCasedToken in Extensions)
          return `${Extensions[camleCasedToken](parseArgs(Arguments, Locals))}`
        else return `${camleCasedToken}(${parseArgs(Arguments, Locals)});`
      }
    }
  } else if (first.type === 'atom')
    return typeof first.value === 'string' ? `\`${first.value}\`` : first.value
  else if (first.type === 'word') return lispToJavaScriptVariableName(token)
}

export const compileToJs = (AST, extensions = {}, helpers = {}, tops = []) => {
  for (const ext in extensions)
    Extensions[lispToJavaScriptVariableName(ext)] = extensions[ext]
  for (const hlp in helpers)
    Helpers[lispToJavaScriptVariableName(hlp)] = helpers[hlp]
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
