import { compileToJs } from './src/compiler.js'
import { evaluate, run } from './src/interpreter.js'
import { parse } from './src/parser.js'

import { readFileSync, writeFileSync } from 'fs'

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
            const parsed = parse(readFileSync(`./lib/${key}.lisp`, 'utf-8'))
              .at(-1)
              .at(-1)
              .slice(1)
            parsed.pop()
            mods.push(
              parsed.filter(
                ([dec, name]) =>
                  dec.type === 'apply' &&
                  dec.value === 'function' &&
                  name.type === 'word' &&
                  depSet.has(name.value)
              )
            )
          }

          const JavaScript = `${top}${
            mods.length
              ? `${mods.map((x) => compileToJs(x).program).join('\n')}\n`
              : '\n'
          }${program}`
          writeFileSync(destination ?? './playground/dist/main.js', JavaScript)
        }
      }
      break
    case '-e':
      {
        switch (value) {
          case 'fs':
            {
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
                      'Invalid number of arguments for (open)'
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
      {
        run(parse(`${readFileSync('./lib/std.lisp', 'utf-8')}\n${file}`), env)
      }
      break
    case '-help':
    case '-h':
    default:
      console.log(`
  -------------------------------------
   -help
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
`)
  }
}
