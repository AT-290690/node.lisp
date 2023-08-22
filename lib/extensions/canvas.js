import { evaluate } from '../../src/interpreter.js'
export default {
  Extensions: {
    ':get-context': (...args) => `$get_context(${args.join(',')});`,
    ':fill-rect': (...args) => `$fill_rect(${args.join(',')});`,
    ':fill-style': (...args) => `$fill_style(${args.join(',')});`,
  },
  Helpers: {
    $get_context: {
      source: `$get_context = (canvas, context) => canvas.getContext(context)`,
    },
    $fill_rect: {
      source: `$fill_rect = (ctx, context) => ctx.fillRect(context)`,
    },
    $fill_style: {
      source: `$fill_style = (ctx, color) => { ctx.fillStyle = color; return ctx } `,
    },
  },
  env: {
    [':get-context']: (args, env) => {
      if (args.length !== 1)
        throw new RangeError('Invalid number of arguments for (:get-context)')
      return evaluate(args[0], env).getAttribute(evaluate(args[1], env))
    },
    [':fill-rect']: (args, env) => {
      if (!args.length)
        throw new RangeError('Invalid number of arguments for (:fill-rect)')
      return evaluate(args[0], env).getAttribute(evaluate(args[1], env))
    },
    [':fill-style']: (args, env) => {
      if (!args.length)
        throw new RangeError('Invalid number of arguments for (:fill-style)')
      return evaluate(args[0], env).getAttribute(evaluate(args[1], env))
    },
  },
}
