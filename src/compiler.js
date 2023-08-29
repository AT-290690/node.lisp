import { APPLY, ATOM, PLACEHOLDER, TYPE, VALUE, WORD } from './enums.js'

export const earMuffsToLodashes = (name) => name.replace(new RegExp(/\*/g), '_')
export const dotNamesToEmpty = (name) => name.replace(new RegExp(/\./g), '')
export const colonNamesTo$ = (name) => name.replace(new RegExp(/\:/g), '$')

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
      if (branch[VALUE] === name) branch[VALUE] = `()=>${newName}`
      deepRename(name, newName, branch)
    }
}
export const lispToJavaScriptVariableName = (name) =>
  toCamelCase(dotNamesToEmpty(colonNamesTo$(earMuffsToLodashes(name))))

const Extensions = {}
const Helpers = {
  log: {
    source: `// Helper Functions\nvar log = (msg) => { console.log(msg); return msg }`,
  },
  _identity: {
    source: `_identity = i => { return i }`,
  },
  tco: {
    source: `tco = fn => (...args) => {
      let result = fn(...args)
      while (typeof result === 'function') result = result()
      return result
    }`,
  },
  'regexp-match': {
    source: `_regExpMatch = (string, regex) => {
      const match = string.match(new RegExp(regex, 'g'))
      return match == undefined ? [] : [...match]
    }`,
  },
  'regexp-replace': {
    source: `_regExpReplace = (string, a, b) => string.replace(new RegExp(a, 'g'), b)`,
  },
  atom: {
    source: `_isAtom = (value) => typeof value === 'number' ||  typeof value === 'bigint' || typeof value === 'string'`,
  },
  set: {
    source: `_set = (array, index, value) => { 
      if (index < 0) {
       const target = array.length + index
       while (array.length !== target) array.pop()
      } else array[index] = value; 
      return array 
  }`,
  },
  error: {
    source: `_error = (error) => { 
      throw new Error(error)
  }`,
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
        return typeof value === 'number' || typeof value === 'bigint' ? [...Number(value).toString()].map(Number) : [...value]
      case 'Bit':
         return parseInt(value, 2)
      case 'Boolean':
          return +!!value
      case 'Function':
          return () => value
       default:
         return 0
      }
    }`,
  },
}
const handleBoolean = (source) => `+${source}`
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

const parse = (Arguments, Variables, Functions) =>
  Arguments.map((x) => compile(x, Variables, Functions))
const parseArgs = (Arguments, Variables, Functions, separator = ',') =>
  parse(Arguments, Variables, Functions).join(separator)
const compile = (tree, Variables, Functions) => {
  if (!tree) return ''
  const [first, ...Arguments] = Array.isArray(tree) ? tree : [tree]
  if (first == undefined) return '[];'
  const token = first[VALUE]
  if (first[TYPE] === APPLY) {
    switch (token) {
      case 'do': {
        if (Arguments.length > 1) {
          return `(${Arguments.map((x) =>
            (compile(x, Variables, Functions) ?? '').toString().trimStart()
          )
            .filter(Boolean)
            .join(',')});`
        } else {
          const res = compile(Arguments[0], Variables, Functions)
          return res !== undefined ? res.toString().trim() : ''
        }
      }
      case 'apply': {
        const [first, ...rest] = Arguments
        const apply = compile(first, Variables, Functions)
        return `${
          apply[apply.length - 1] === ';'
            ? apply.substring(0, apply.length - 1)
            : apply
        }(${parseArgs(rest, Variables, Functions)})`
      }
      case 'destructuring-bind': {
        let out = '(('
        const rigth = compile(Arguments.pop(), Variables, Functions)
        const _rest = Arguments.pop()
        const len = Arguments.length
        for (let i = 0; i < len; ++i) {
          const NAME = Arguments[i][VALUE]
          if (NAME !== PLACEHOLDER) {
            const name = lispToJavaScriptVariableName(NAME)
            Variables.add(name)
            out += `${name}=${rigth}.at(${i})${i !== len - 1 ? ',' : ''}`
          } else {
            out += i !== len - 1 ? ',' : ''
          }
        }
        if (_rest[VALUE] !== PLACEHOLDER) {
          const rest = lispToJavaScriptVariableName(_rest[VALUE])
          Variables.add(rest)
          out += `,${rest}=(${rigth}).slice(${len})), ${rigth});`
        } else out += `), ${rigth});`
        return out
      }
      case 'defconstant':
      case 'defvar': {
        let name,
          out = '(('
        for (let i = 0, len = Arguments.length; i < len; ++i) {
          const arg = Arguments[i]
          if (i % 2 === 0 && arg[TYPE] === WORD) {
            name = lispToJavaScriptVariableName(arg[VALUE])
            Variables.add(name)
          } else
            out += `${name}=${compile(arg, Variables, Functions)}${
              i !== len - 1 ? ',' : ''
            }`
        }
        out += `),${name});`
        return out
      }
      case 'setf':
      case 'boole': {
        const res = compile(Arguments[1], Variables, Functions)
        const arg = Arguments[0]
        if (arg[TYPE] === WORD) {
          const name = lispToJavaScriptVariableName(arg[VALUE])
          return `((${name}=${res}),${name});`
        }
        return ''
      }
      case 'char':
        return `(String.fromCharCode(${compile(
          Arguments[0],
          Variables,
          Functions
        )}));`
      case 'char-code':
        return `((${compile(
          Arguments[0],
          Variables,
          Functions
        )}).charCodeAt(${compile(Arguments[1], Variables, Functions)}));`
      case 'make-string':
        return `(String.fromCharCode(...${compile(
          Arguments[0],
          Variables,
          Functions
        )}));`
      case 'format':
        return `((${compile(
          Arguments[0],
          Variables,
          Functions
        )}).split(${compile(Arguments[1], Variables, Functions)}));`
      case 'regex-match':
        return `_regExpMatch(${parseArgs(Arguments, Variables, Functions)});`
      case 'regex-replace':
        return `_regExpReplace(${parseArgs(Arguments, Variables, Functions)});`
      case 'Stringp':
        return handleBoolean(
          `(typeof(${compile(Arguments[0], Variables, Functions)})==='string');`
        )
      case 'Numberp':
        return handleBoolean(
          `(typeof(${compile(Arguments[0], Variables, Functions)})==='number');`
        )
      case 'Integerp':
        return handleBoolean(
          `(typeof(${compile(Arguments[0], Variables, Functions)})==='bigint');`
        )
      case 'Functionp':
        return `(typeof(${compile(
          Arguments[0],
          Variables,
          Functions
        )})==='function');`
      case 'Arrayp':
        return `(Array.isArray(${compile(
          Arguments[0],
          Variables,
          Functions
        )}));`
      case 'Number':
        return '0'
      case 'Integer':
        return '0n'
      case 'Boolean':
        return '1'
      case 'String':
        return '""'
      case "'":
        return `[${parseArgs(Arguments, Variables, Functions)}];`
      case 'Array':
        return Arguments.length === 2 &&
          Arguments[1][TYPE] === WORD &&
          Arguments[1][VALUE] === 'length'
          ? `(new Array(${compile(
              Arguments[0],
              Variables,
              Functions
            )}).fill(0))`
          : `[${parseArgs(Arguments, Variables, Functions)}];`
      case 'Function':
        return '(()=>{});'
      case 'length':
        return `(${compile(Arguments[0], Variables, Functions)}).length`
      case 'atom':
        return handleBoolean(
          `_isAtom(${compile(Arguments[0], Variables, Functions)});`
        )
      case 'car':
        return `${compile(Arguments[0], Variables, Functions)}.at(0);`
      case 'cdr':
        return `${compile(Arguments[0], Variables, Functions)}.slice(1);`
      case 'get':
        return `${compile(Arguments[0], Variables, Functions)}.at(${compile(
          Arguments[1],
          Variables,
          Functions
        )});`
      case 'set':
        return `_set(${parseArgs(Arguments, Variables, Functions)});`
      case 'lambda': {
        const functionArgs = Arguments
        const body = Arguments.pop()
        const Variables = new Set()
        const evaluatedBody = compile(body, Variables, Functions)
        const vars = Variables.size ? `var ${[...Variables].join(',')};` : ''
        return `((${parseArgs(
          functionArgs.map((node, index) =>
            node[VALUE] === PLACEHOLDER
              ? { [TYPE]: node[TYPE], [VALUE]: `_${index}` }
              : { [TYPE]: node[TYPE], [VALUE]: node[VALUE] }
          ),
          Variables
        )})=>{${vars}return ${evaluatedBody.toString().trimStart()}});`
      }
      case 'loop': {
        let name,
          newName,
          out = '(('
        const arg = Arguments[1]
        name = lispToJavaScriptVariableName(arg[VALUE])
        newName = `rec_${performance.now().toString().replace('.', 7)}`
        Variables.add(name)
        Variables.add(newName)
        const functionArgs = Arguments.slice(2)
        const body = functionArgs.pop()
        const FunctionVariables = new Set()
        deepRename(arg[VALUE], newName, body)
        const evaluatedBody = compile(body, FunctionVariables, Functions)
        const vars = FunctionVariables.size
          ? `var ${[...FunctionVariables].join(',')};`
          : ''
        out += `${name}=(tco(${newName}=(${parseArgs(
          functionArgs,
          Variables
        )})=>{${vars}return ${evaluatedBody.toString().trimStart()}};`
        out += `, ${newName}))), ${name});`
        return out
      }
      case 'defun': {
        let name,
          out = '(('
        const arg = Arguments[0]
        name = lispToJavaScriptVariableName(arg[VALUE])
        Variables.add(name)
        const functionArgs = Arguments.slice(1)
        const body = functionArgs.pop()
        const FunctionVariables = new Set()
        const evaluatedBody = compile(body, FunctionVariables, Functions)
        const vars = FunctionVariables.size
          ? `var ${[...FunctionVariables].join(',')};`
          : ''
        out += `${name}=(${parseArgs(
          functionArgs.map((node, index) =>
            node[VALUE] === PLACEHOLDER
              ? { [TYPE]: node[TYPE], [VALUE]: `_${index}` }
              : { [TYPE]: node[TYPE], [VALUE]: node[VALUE] }
          ),
          Variables
        )})=>{${vars}return ${evaluatedBody.toString().trimStart()}};`
        out += `),${name});`
        return out
      }
      case 'and':
        return `(${parseArgs(Arguments, Variables, Functions, '&&')});`
      case 'or':
        return `((${parseArgs(Arguments, Variables, Functions, '||')}) || 0);`
      case 'concatenate':
        return '(' + parseArgs(Arguments, Variables, Functions, '+') + ');'
      case '=':
        return handleBoolean(
          `(${parseArgs(Arguments, Variables, Functions, '===')});`
        )
      case '>=':
      case '<=':
      case '>':
      case '<':
        return handleBoolean(
          `(${parseArgs(Arguments, Variables, Functions, token)});`
        )
      case '-':
        return Arguments.length === 1
          ? `(-${compile(Arguments[0], Variables, Functions)});`
          : `(${parse(Arguments, Variables, Functions)
              // Add space so it doesn't consider it 2--1 but 2- -1
              .map((x) => (typeof x === 'number' && x < 0 ? ` ${x}` : x))
              .join(token)});`
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
        return `(${parseArgs(Arguments, Variables, Functions, token)});`
      case 'mod':
        return `(${compile(Arguments[0], Variables, Functions)}%${compile(
          Arguments[1],
          Variables,
          Functions
        )});`
      case '/':
        return `(1/${compile(Arguments[0], Variables, Functions)});`
      case 'Bit':
        return `(${compile(
          Arguments[0],
          Variables,
          Functions
        )}>>>0).toString(2)`
      case '~':
        return `~(${compile(Arguments[0], Variables, Functions)})`
      case 'not':
        return `(${handleBoolean(
          `!${compile(Arguments[0], Variables, Functions)}`
        )})`
      case 'if': {
        return `(${compile(Arguments[0], Variables, Functions)}?${compile(
          Arguments[1],
          Variables,
          Functions
        )}:${
          Arguments.length === 3
            ? compile(Arguments[2], Variables, Functions)
            : 0
        });`
      }
      case 'when': {
        return `(${compile(Arguments[0], Variables, Functions)}?${compile(
          Arguments[1],
          Variables,
          Functions
        )}:0);`
      }
      case 'unless': {
        return `(${compile(Arguments[0], Variables, Functions)}?${
          Arguments.length === 3
            ? compile(Arguments[2], Variables, Functions)
            : 0
        }:${compile(Arguments[1], Variables, Functions)});`
      }
      case 'otherwise': {
        return `(${compile(Arguments[0], Variables, Functions)}?0:${compile(
          Arguments[1],
          Variables,
          Functions
        )});`
      }
      case 'cond': {
        let out = '('
        for (let i = 0; i < Arguments.length; i += 2)
          out += `${compile(Arguments[i], Variables, Functions)}?${compile(
            Arguments[i + 1],
            Variables,
            Functions
          )}:`
        out += '0);'
        return out
      }
      case 'type':
        return `_cast("${Arguments[1][VALUE]}", ${compile(
          Arguments[0],
          Variables,
          Functions
        )})`

      case 'go': {
        let inp = Arguments[0]
        for (let i = 1; i < Arguments.length; ++i)
          inp = [Arguments[i].shift(), inp, ...Arguments[i]]
        return compile(inp, Variables, Functions)
      }
      case 'sleep': {
        return `setTimeout(${compile(
          Arguments[1],
          Variables,
          Functions
        )},${compile(Arguments[0], Variables, Functions)});`
      }
      case 'throw': {
        return `_error(${compile(Arguments[0], Variables, Functions)})`
      }
      case 'import':
        {
          const [module, ...functions] = Arguments.map((x) =>
            compile(x, Variables, Functions)
          )
          Functions.set(
            module,
            functions.map((fn) => {
              const name = lispToJavaScriptVariableName(
                fn.substring(1, fn.length - 1)
              )
              Variables.add(name)
              return name
            })
          )
        }
        break
      case 'identity':
      case 'probe-file':
      case 'void':
      case 'deftype':
      case 'Or':
      case 'Function':
        return ''
      default: {
        const camleCasedToken = lispToJavaScriptVariableName(token)
        if (camleCasedToken in Extensions)
          return `${Extensions[camleCasedToken](
            parseArgs(Arguments, Variables, Functions)
          )}`
        else
          return `${camleCasedToken}(${parseArgs(
            Arguments,
            Variables,
            Functions
          )});`
      }
    }
  } else if (first[TYPE] === ATOM)
    return typeof first[VALUE] === 'string'
      ? `\`${first[VALUE]}\``
      : first[VALUE]
  else if (first[TYPE] === WORD) return lispToJavaScriptVariableName(token)
}

export const compileToJs = (AST, extensions = {}, helpers = {}, tops = []) => {
  for (const ext in extensions)
    Extensions[lispToJavaScriptVariableName(ext)] = extensions[ext]
  for (const hlp in helpers)
    Helpers[lispToJavaScriptVariableName(hlp)] = helpers[hlp]
  const Variables = new Set()
  const Functions = new Map()
  const raw = AST.map((tree) => compile(tree, Variables, Functions))
    .filter(Boolean)
    .join('\n')
  let program = '// Source Code \n'
  for (let i = 0; i < raw.length; ++i) {
    const current = raw[i]
    const next = raw[i + 1]
    if (!semiColumnEdgeCases.has(current + next)) program += current
  }
  const top = `${tops.join('\n')}${Object.values(Helpers)
    .map((x) => x.source)
    .join(',')};\n${Variables.size ? `var ${[...Variables].join(',')};` : ''}`
  return { top, program, deps: [...Functions] }
}
