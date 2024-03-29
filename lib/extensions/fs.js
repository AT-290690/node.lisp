import { readFileSync, writeFileSync } from 'fs'
import { evaluate } from '../../src/interpreter.js'
export default {
  Extensions: {
    ':write': (path, data) => `writeFileSync(${path}, ${data}, 'utf-8');`,
    ':open': (path) => `readFileSync(${path}, 'utf-8');`,
  },
  Tops: [`import { writeFileSync, readFileSync } from 'fs';`],
  env: {
    [':open']: (args, env) => {
      if (!args.length)
        throw new RangeError('Invalid number of arguments for (:open)')
      const path = evaluate(args[0], env)
      if (typeof path !== 'string')
        throw new TypeError('First argument of (:open) is not a string path')
      return readFileSync(path, 'utf-8')
    },
    [':write']: (args, env) => {
      if (!args.length)
        throw new RangeError('Invalid number of arguments for (:write)')
      const path = evaluate(args[0], env)
      if (typeof path !== 'string')
        throw new TypeError('First argument of (:write) is not a string path')
      const data = evaluate(args[1], env)
      if (typeof data !== 'string')
        throw new TypeError('Second argument of (:write) is not a string data')
      writeFileSync(path, data, 'utf-8')
      return data
    },
  },
}
