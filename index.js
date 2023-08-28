import { readFileSync, writeFileSync } from 'fs'
import { start } from 'repl'
import { compileToJs } from './src/compiler.js'
import { evaluate, run, stacktrace } from './src/interpreter.js'
import { parse } from './src/parser.js'
import domExtension from './lib/extensions/dom.js'
import fsExtension from './lib/extensions/fs.js'
import canvasExtension from './lib/extensions/canvas.js'

// import wabt from 'wabt'
import {
  isBalancedParenthesis,
  logError,
  removeNoCode,
  runFromCompiled,
  runFromInterpreted,
  treeShake,
} from './src/utils.js'
import STD from './lib/baked/std.js'
import DOM from './lib/baked/dom.js'
import MATH from './lib/baked/math.js'
import { tokens } from './src/tokeniser.js'
import { APPLY, TYPE, VALUE, WORD } from './src/enums.js'
const libraries = {
  std: STD,
  dom: DOM,
  math: MATH,
}
const cli = async () => {
  const [, , ...argv] = process.argv
  let file = '',
    Extensions = {},
    Helpers = {},
    Tops = [],
    env = {},
    destination = undefined,
    lib = 'std'
  while (argv.length) {
    const flag = argv.shift()?.toLowerCase()
    const value = argv.shift()
    if (!flag) throw new Error('No flag provided')
    switch (flag) {
      case '-m':
        console.log(removeNoCode(file))
        break
      case '-d':
        destination = value
        break
      case '-s':
        file = readFileSync(value, 'utf-8')
        break
      case '-c':
        {
          const tree = parse(file)
          if (Array.isArray(tree)) {
            const { top, program, deps } = compileToJs(
              tree,
              Extensions,
              Helpers,
              Tops
            )
            const JavaScript = `${top}${treeShake(
              deps,
              JSON.parse(JSON.stringify(Object.values(libraries)))
            )}${program}`
            writeFileSync(
              destination ?? './playground/dist/main.js',
              JavaScript
            )
          }
        }
        break
      case '-e':
        {
          switch (value) {
            case 'fs':
              {
                Extensions = { ...Extensions, ...fsExtension.Extensions }
                Helpers = { ...Helpers, ...fsExtension.Helpers }
                Tops = [...Tops, ...fsExtension.Tops]
                env = { ...env, ...fsExtension.env }
              }
              break

            case 'dom':
              {
                Extensions = { ...Extensions, ...domExtension.Extensions }
                Helpers = { ...Helpers, ...domExtension.Helpers }
                Tops = [...Tops, ...domExtension.Tops]
                env = { ...env, ...domExtension.env }
              }
              break
            case 'canvas':
              {
                Extensions = { ...Extensions, ...canvasExtension.Extensions }
                Helpers = { ...Helpers, ...canvasExtension.Helpers }
                Tops = [...Tops, ...canvasExtension.Tops]
                env = { ...env, ...canvasExtension.env }
              }
              break
          }
        }
        break
      case '-p':
        try {
          run(parse(file), env)
        } catch (err) {
          logError(err.message)
        }
        break
      case '-r':
        try {
          run(
            [
              ...libraries['std'],
              ...libraries['math'],
              ...libraries['dom'],
              ...parse(file),
            ],
            env
          )
        } catch (err) {
          logError('Error')
          logError(err.message)
          console.log(
            ` \x1b[30m${[...stacktrace]
              .reverse()
              .filter(Boolean)
              .join('\n ')}\x1b[0m`
          )
        }
        break
      case '-trace':
        try {
          run(
            [
              ...libraries['std'],
              ...libraries['math'],
              ...libraries['dom'],
              ...parse(file),
            ],
            env
          )
        } catch (err) {
          console.log('\x1b[40m', err, '\x1b[0m')
          logError(err.message)
        }
        break
      case '-lib':
        lib = value
        break
      case '-doc':
        {
          const mods = []
          const parsed = libraries[lib].at(-1).at(-1).slice(1)
          parsed.pop()
          mods.push(
            parsed.filter(
              ([dec, name]) =>
                dec[TYPE] === APPLY &&
                dec[VALUE] === 'defun' &&
                name[TYPE] === WORD
            )
          )
          ;(value
            ? mods.flat(1).filter(([, x]) => x[VALUE].includes(value))
            : mods.flat(1)
          ).forEach(([, name, ...rest]) => {
            console.log(
              `(\x1b[33m${name[VALUE]}\x1b[36m ${rest
                .map((x) => x[VALUE])
                .join(' ')
                .trimRight()}\x1b[0m)`
            )
          })
        }
        break
      case '-import':
        {
          const mods = []
          const parsed = libraries[lib].at(-1).at(-1).slice(1)
          parsed.pop()
          mods.push(
            parsed.filter(
              ([dec, name]) =>
                dec[TYPE] === APPLY &&
                dec[VALUE] === 'defun' &&
                name[TYPE] === WORD
            )
          )
          console.log(
            `\x1b[35m${(value
              ? mods.flat(1).filter(([, x]) => x[VALUE].includes(value))
              : mods.flat(1)
            )
              .map(([, name]) => {
                return `"${name[VALUE].trimRight()}"`
              })
              .join(' ')}\x1b[0m`
          )
        }
        break
      case '-repl':
        {
          let source = ''
          const inpColor = '\x1b[32m'
          const outColor = '\x1b[33m'
          const errColor = '\x1b[31m'
          console.log(inpColor)
          start({
            prompt: '',
            eval: (input) => {
              try {
                let out = `${source}\n${file}\n(do ${input})`
                const result = run(
                  [...libraries['std'], ...libraries['math'], ...parse(out)],
                  env
                )
                if (typeof result === 'function') {
                  console.log(inpColor, `(λ)`)
                } else if (Array.isArray(result)) {
                  console.log(
                    outColor,
                    JSON.stringify(result, (_, value) => {
                      switch (typeof value) {
                        case 'bigint':
                          return Number(value)
                        case 'function':
                          return 'λ'
                        case 'undefined':
                        case 'symbol':
                          return 0
                        case 'boolean':
                          return +value
                        default:
                          return value
                      }
                    })
                      .replace(new RegExp(/\[/g), '(')
                      .replace(new RegExp(/\]/g), ')')
                      .replace(new RegExp(/\,/g), ' ')
                      .replace(new RegExp(/"λ"/g), 'λ'),
                    inpColor
                  )
                } else if (typeof result === 'string') {
                  console.log(outColor, `"${result}"`, inpColor)
                } else if (result == undefined) {
                  console.log(errColor, '(void)', inpColor)
                } else {
                  console.log(outColor, result, inpColor)
                }
                source = out
              } catch (err) {
                console.log(errColor, err.message, inpColor)
              }
            },
          })
        }
        break
      case '-help':
      case '-h':
      default:
        console.log(`
-------------------------------------
-help
-------------------------------------
-lib                      target lib
-------------------------------------
-doc              list lib functions
-------------------------------------
-import           log import for lib
-------------------------------------
-s                    prepare a file
-------------------------------------
-d               file to compile js
-------------------------------------
-c                    compile to js
-------------------------------------
-r                  interpret & run
-------------------------------------
-p      interpret & run with 0 deps
-------------------------------------
-m                      minify code 
-------------------------------------
-repl    start Read Eval Print Loop
-------------------------------------
`)
    }
  }
}

export default {
  cli,
  interpred: runFromInterpreted,
  compile: runFromCompiled,
  js: compileToJs,
  parse,
  tokens,
  evaluate,
  balance: isBalancedParenthesis,
  source: removeNoCode,
  run,
  libraries,
  treeShake,
}
