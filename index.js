import { readFileSync, writeFileSync } from 'fs'
import { start } from 'repl'
import { compileToJs, lispToJavaScriptVariableName } from './src/compiler.js'
import { evaluate, run } from './src/interpreter.js'
import { parse } from './src/parser.js'
// import wabt from 'wabt'
import {
  isBalancedParenthesis,
  logError,
  removeNoCode,
  runFromCompiled,
  runFromInterpreted,
} from './src/utils.js'
import { tokens } from './src/tokeniser.js'
import std from './lib/std.js'
const cli = async () => {
  const [, , ...argv] = process.argv
  let file = '',
    Extensions = {},
    Helpers = {},
    Tops = [],
    env = {},
    destination = undefined
  while (argv.length) {
    const flag = argv.shift()?.toLowerCase()
    const value = argv.shift()
    if (!flag) throw new Error('No flag provided')
    switch (flag) {
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
            const mods = []
            for (const [key, value] of deps) {
              const depSet = new Set(value)
              const parsed = parse(std).at(-1).at(-1).slice(1)
              parsed.pop()
              mods.push(
                parsed.filter(
                  ([dec, name]) =>
                    dec.type === 'apply' &&
                    dec.value === 'defun' &&
                    name.type === 'word' &&
                    depSet.has(lispToJavaScriptVariableName(name.value))
                )
              )
            }

            const JavaScript = `${top}${
              mods.length
                ? `${mods.map((x) => compileToJs(x).program).join('\n')}\n`
                : '\n'
            }${program}`
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
                // const { readWasm, parseWat } = await wabt()
                // module: (args, env) => {
                //   const out = args.map((x) => evaluate(x, env))
                //   const string = `(module ${out
                //     .flat(1)
                //     // .map((x) => x.replace(new RegExp(/'/g), '"'))
                //     .join(' ')})`
                //   // console.log(readWasm(), {
                //   //   readDebugNames: true,
                //   // })
                //   // console.log({ string: })
                //   // Buffer.from(string, 'utf-8')
                //   // console.log(parseWat('main.wat', string))
                //   console.log({ string })
                //   console.log(
                //     readWasm(parseWat('main.wat', string), {
                //       readDebugNames: true,
                //     })
                //   )
                //   return string
                //   // parseWat('main.wat', args string)
                //   // const wasmModule = wabt.parseWat(inputWat, readFileSync(inputWat, "utf8"));
                //   // const { buffer } = wasmModule.toBinary({});
                // },
                Extensions = {
                  write: (path, data) =>
                    `writeFileSync(${path}, ${data}, 'utf-8);`,
                  open: (path) => `readFileSync(${path}, 'utf-8');`,
                }
                Tops = [`import { writeFileSync, readFileSync } from 'fs';`]
                // Helpers = {
                //   _open: {
                //     source: `_open = require('fs').readFileSync`,
                //     has: true,
                //   },
                // },
                env = {
                  open: (args, env) => {
                    if (!args.length)
                      throw new RangeError(
                        'Invalid number of arguments for (open)'
                      )
                    const path = evaluate(args[0], env)
                    if (typeof path !== 'string')
                      throw new TypeError(
                        'First argument of (open) is not a string path'
                      )
                    return readFileSync(path, 'utf-8')
                  },
                  write: (args, env) => {
                    if (!args.length)
                      throw new RangeError(
                        'Invalid number of arguments for (write)'
                      )
                    const path = evaluate(args[0], env)
                    if (typeof path !== 'string')
                      throw new TypeError(
                        'First argument of (write) is not a string path'
                      )
                    const data = evaluate(args[1], env)
                    if (typeof data !== 'string')
                      throw new TypeError(
                        'Second argument of (write) is not a string data'
                      )
                    writeFileSync(path, data, 'utf-8')
                    return data
                  },
                }
              }
              break
          }
        }
        break
      case '-p':
        run(parse(file), env)
        break
      case '-r':
        try {
          run(parse(`${std}\n${file}`), env)
        } catch (err) {
          logError(err.message)
        }
        break
      case '-std':
        {
          const mods = []
          const parsed = parse(std).at(-1).at(-1).slice(1)
          parsed.pop()
          mods.push(
            parsed.filter(
              ([dec, name]) =>
                dec.type === 'apply' &&
                dec.value === 'defun' &&
                name.type === 'word'
            )
          )
          ;(value
            ? mods.flat(1).filter(([, x]) => x.value.includes(value))
            : mods.flat(1)
          ).forEach(([, name, ...rest]) => {
            console.log(
              `(\x1b[35mƒ\x1b[33m ${name.value}\x1b[36m ${rest
                .map((x) => x.value)
                .join(' ')
                .trimRight()}\x1b[0m)`
            )
          })
        }
        break
      case '-import':
        {
          const mods = []
          const parsed = parse(std).at(-1).at(-1).slice(1)
          parsed.pop()
          mods.push(
            parsed.filter(
              ([dec, name]) =>
                dec.type === 'apply' &&
                dec.value === 'function' &&
                name.type === 'word'
            )
          )
          console.log(
            `\x1b[35m${(value
              ? mods.flat(1).filter(([, x]) => x.value.includes(value))
              : mods.flat(1)
            )
              .map(([, name]) => {
                return `"${name.value.trimRight()}"`
              })
              .join(' ')}\x1b[0m`
          )
        }
        break
      case '-repl':
        {
          let source = std
          const inpColor = '\x1b[32m'
          const outColor = '\x1b[33m'
          const errColor = '\x1b[31m'
          console.log(inpColor)
          start({
            prompt: '',
            eval: (input) => {
              try {
                let out = `${source}\n${file}\n(do ${input})`
                const result = run(parse(out), env)
                if (typeof result === 'function') {
                  console.log(inpColor, `(λ)`)
                } else if (Array.isArray(result)) {
                  console.log(
                    outColor,
                    JSON.stringify(result)
                      .replace(new RegExp(/\[/g), '(')
                      .replace(new RegExp(/\]/g), ')')
                      .replace(new RegExp(/\,/g), ' '),
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
-std             list std functions
-------------------------------------
-import          log import for std
-------------------------------------
-s                   prepare a file
-------------------------------------
-d               file to compile js
-------------------------------------
-c                    compile to js
-------------------------------------
-r                  interpret & run
-------------------------------------
-p      interpret & run with 0 deps
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
  std,
}
