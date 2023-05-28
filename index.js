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
    case '-destination':
    case '-dist':
      destination = value
      break
    case '-file':
    case '-f':
    case '-source':
    case '-s':
      file = readFileSync(value, 'utf-8')
      break
    case '-dep':
      file = `${readFileSync(value, 'utf-8')}\n${file}`
      break
    case '-js':
      {
        const tree = parse(file)
        if (Array.isArray(tree)) {
          const compiled = compileToJs(tree, Extensions, Helpers, Tops)
          const JavaScript = `${compiled.top}\n${compiled.program}`
          console.log(JavaScript)
        }
      }
      break
    case '-compile':
      {
        const tree = parse(file)
        if (Array.isArray(tree)) {
          const compiled = compileToJs(tree, Extensions, Helpers, Tops)
          const JavaScript = `${compiled.top}\n${compiled.program}`
          writeFileSync(destination ?? './playground/dist/main.js', JavaScript)
        }
      }
      break
    case '-env':
      {
        switch (value) {
          case 'fs':
            {
              Extensions = {
                open: (path) => `readFileSync(${path}, 'utf-8');`,
              }
              Tops = [`import { readFileSync } from 'fs';`]
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
                    throw new TypeError('Path is not a string in (open)')
                  return readFileSync(path, 'utf-8')
                },
              }
            }
            break
        }
      }
      break
    case '-log':
      {
        const tree = parse(file)
        if (Array.isArray(tree)) console.log(run(tree, env))
      }
      break
    case '-run':
    case '-r':
      {
        const tree = parse(file)
        if (Array.isArray(tree)) run(tree, env)
      }
      break
    case '-help':
    default:
      console.log(`
  -------------------------------------
   -help
  -------------------------------------
   -file                prepare a file
  -------------------------------------
   -dep           include dependencies
  -------------------------------------
   -js           log javascript output
  -------------------------------------
   -compile              compile to js
  -------------------------------------
   -dist            file to compile js
  -------------------------------------
   -run              interpret and run
  -------------------------------------
   -log              interpret and log
  -------------------------------------
`)
  }
}
