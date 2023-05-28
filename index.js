import { compileToJs } from './src/compiler.js'
import { run } from './src/interpreter.js'
import { parse } from './src/parser.js'

import { readFileSync, writeFileSync } from 'fs'

const [, , ...argv] = process.argv
let file = '',
  std = false,
  destination
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
          const compiled = compileToJs(tree)
          console.log(`${compiled.top}${compiled.program}`)
        }
      }
      break
    case '-compile':
      {
        const tree = parse(file)
        if (Array.isArray(tree)) {
          const compiled = compileToJs(tree)
          writeFileSync(
            destination ?? './playground/dist/main.js',
            `${compiled.top}\n${compiled.program}`
          )
        }
      }
      break
    case '-log':
      {
        const tree = parse(file)
        if (Array.isArray(tree)) console.log(run(tree))
      }
      break
    case '-run':
    case '-r':
      {
        const tree = parse(file)
        if (Array.isArray(tree)) run(tree)
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
