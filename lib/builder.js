import { readFileSync, writeFileSync } from 'fs'
import { parse } from '../src/parser.js'
const LIB = process.argv[2]?.trim()
if (!LIB) throw new Error('Missing library name')
const lib = readFileSync(`./lib/${LIB}.lisp`, 'utf-8')
writeFileSync(
  `./lib/${LIB}.js`,
  `export default ${JSON.stringify(parse(lib))}`,
  'utf-8'
)
