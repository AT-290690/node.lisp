import { readFileSync, writeFileSync } from 'fs'
import { parse } from '../src/parser.js'
const std = readFileSync('./lib/std.lisp', 'utf-8')
writeFileSync(
  './lib/std.js',
  `export const STD = ${JSON.stringify(parse(std))}`,
  'utf-8'
)
