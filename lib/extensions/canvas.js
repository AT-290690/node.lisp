import { evaluate } from '../../src/interpreter.js'
export default {
  Extensions: {
    ':get-context': (...args) => `$get_context(${args.join(',')});`,
    ':rect': (...args) => `$rect(${args.join(',')});`,
    ':fill-rect': (...args) => `$fill_rect(${args.join(',')});`,
    ':fill-style': (...args) => `$fill_style(${args.join(',')});`,
    ':stroke': (...args) => `$stroke(${args.join(',')});`,
    ':fill': (...args) => `$fill(${args.join(',')});`,
    ':begin-path': (...args) => `$begin_path(${args.join(',')});`,
    ':save': (...args) => `$save(${args.join(',')});`,
    ':restore': (...args) => `$restore(${args.join(',')});`,
    ':stroke-style': (...args) => `$stroke_style(${args.join(',')});`,
    ':line-to': (...args) => `$line_to(${args.join(',')});`,
    ':move-to': (...args) => `$move_to(${args.join(',')});`,
    ':scale': (...args) => `$scale(${args.join(',')});`,
    ':rotate': (...args) => `$rotate(${args.join(',')});`,
    ':translate': (...args) => `$translate(${args.join(',')});`,
    ':line-width': (...args) => `$line_width(${args.join(',')});`,
  },
  Helpers: {
    $get_context: {
      source: `$get_context=(canvas,context)=>canvas.getContext(context)`,
    },
    $rect: {
      source: `$fill_rect=(ctx,x,y,w,h)=>{ctx.rect(x,y,w,h);return ctx}`,
    },
    $fill_rect: {
      source: `$fill_rect=(ctx,x,y,w,h)=>{ctx.fillRect(x,y,w,h);return ctx}`,
    },
    $fill_style: {
      source: `$fill_style=(ctx,color)=>{ctx.fillStyle=color;return ctx} `,
    },
    $begin_path: {
      source: `$begin_path=(ctx)=>{ctx.beginPath();return ctx}`,
    },
    $fill: {
      source: `$stroke=(ctx)=>{ctx.fill();return ctx}`,
    },
    $stroke: {
      source: `$stroke=(ctx)=>{ctx.stroke();return ctx}`,
    },
    $save: {
      source: `$stroke=(ctx)=>{ctx.save();return ctx}`,
    },
    $restore: {
      source: `$stroke=(ctx)=>{ctx.restore();return ctx}`,
    },
    $stroke_style: {
      source: `$stroke_style=(ctx,color)=>{ctx.strokeStyle=color;return ctx} `,
    },
    $line_width: {
      source: `$line_width=(ctx,w)=>{ctx.lineWidth=w;return ctx} `,
    },
    $line_to: {
      source: `$line_to=(ctx,x,y)=>{ctx.lineTo(x,y);return ctx}`,
    },
    $move_to: {
      source: `$move_to=(ctx,x,y)=>{ctx.moveTo(x,y);return ctx}`,
    },
    $scale: {
      source: `$scale=(ctx,x,y)=>{ctx.scale(x,y);return ctx}`,
    },
    $rotate: {
      source: `$rotate=(ctx,a)=>{ctx.rotate(a);return ctx}`,
    },
    $translate: {
      source: `$translate=(ctx,x,y)=>{ctx.translate(x,y);return ctx}`,
    },
  },
  env: {
    [':get-context']: (args, env) => {
      if (args.length !== 2)
        throw new RangeError('Invalid number of arguments for (:get-context)')
      return evaluate(args[0], env).getContext(evaluate(args[1], env))
    },
    [':rect']: (args, env) => {
      if (args.length !== 5)
        throw new RangeError('Invalid number of arguments for (:rect)')
      const ctx = evaluate(args[0], env)
      ctx.fillRect(
        evaluate(args[1], env),
        evaluate(args[2], env),
        evaluate(args[3], env),
        evaluate(args[4], env)
      )
      return ctx
    },
    [':fill-rect']: (args, env) => {
      if (args.length !== 5)
        throw new RangeError('Invalid number of arguments for (:fill-rect)')
      const ctx = evaluate(args[0], env)
      ctx.fillRect(
        evaluate(args[1], env),
        evaluate(args[2], env),
        evaluate(args[3], env),
        evaluate(args[4], env)
      )
      return ctx
    },
    [':begin-path']: (args, env) => {
      if (args.length)
        throw new RangeError('Invalid number of arguments for (:begin-path)')
      const ctx = evaluate(args[0], env)
      ctx.beginPath()
      return ctx
    },
    [':fill-style']: (args, env) => {
      if (args.length !== 2)
        throw new RangeError('Invalid number of arguments for (:fill-style)')
      const ctx = evaluate(args[0], env)
      ctx.fillStyle = evaluate(args[1], env)
      return ctx
    },
    [':stroke-style']: (args, env) => {
      if (args.length !== 2)
        throw new RangeError('Invalid number of arguments for (:stroke-style)')
      const ctx = evaluate(args[0], env)
      ctx.strokeStyle = evaluate(args[1], env)
      return ctx
    },
    [':line-width']: (args, env) => {
      if (args.length !== 2)
        throw new RangeError('Invalid number of arguments for (:line-width)')
      const ctx = evaluate(args[0], env)
      ctx.lineWidth = evaluate(args[1], env)
      return ctx
    },
    [':fill']: (args, env) => {
      if (args.length)
        throw new RangeError('Invalid number of arguments for (:fill)')
      const ctx = evaluate(args[0], env)
      ctx.fill()
      return ctx
    },
    [':stroke']: (args, env) => {
      if (args.length)
        throw new RangeError('Invalid number of arguments for (:stroke)')
      const ctx = evaluate(args[0], env)
      ctx.stroke()
      return ctx
    },
    [':save']: (args, env) => {
      if (args.length)
        throw new RangeError('Invalid number of arguments for (:save)')
      const ctx = evaluate(args[0], env)
      ctx.save()
      return ctx
    },
    [':restore']: (args, env) => {
      if (args.length)
        throw new RangeError('Invalid number of arguments for (:restore)')
      const ctx = evaluate(args[0], env)
      ctx.restore()
      return ctx
    },
    [':move-to']: (args, env) => {
      if (args.length !== 3)
        throw new RangeError('Invalid number of arguments for (:move-to)')
      const ctx = evaluate(args[0], env)
      ctx.moveTo(evaluate(args[1], env), evaluate(args[2], env))
      return ctx
    },
    [':line-to']: (args, env) => {
      if (args.length !== 3)
        throw new RangeError('Invalid number of arguments for (:line-to)')
      const ctx = evaluate(args[0], env)
      ctx.lineTo(evaluate(args[1], env), evaluate(args[2], env))
      return ctx
    },
    [':scale']: (args, env) => {
      if (args.length !== 3)
        throw new RangeError('Invalid number of arguments for (:scale)')
      const ctx = evaluate(args[0], env)
      ctx.scale(evaluate(args[1], env), evaluate(args[2], env))
      return ctx
    },
    [':translate']: (args, env) => {
      if (args.length !== 2)
        throw new RangeError('Invalid number of arguments for (:translate)')
      const ctx = evaluate(args[0], env)
      ctx.translate(evaluate(args[1], env), evaluate(args[2], env))
      return ctx
    },
    [':rotate']: (args, env) => {
      if (args.length !== 2)
        throw new RangeError('Invalid number of arguments for (:rotate)')
      const ctx = evaluate(args[0], env)
      ctx.scale(evaluate(args[1], env))
      return ctx
    },
  },
}
