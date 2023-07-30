import { throws } from 'assert'
import { runFromInterpreted } from '../src/utils.js'
const checks = (source, type) => throws(() => runFromInterpreted(source), type)
describe('Errors', () => {
  it('Should throw errors', () => {
    checks(`(do x)`, ReferenceError)
    checks(`(defvar x 10) (x)`, TypeError)
    checks(`(+ 1 2 "3")`, TypeError)
    checks(`(/ 0)`, TypeError)
    checks(`(mod 2 0)`, TypeError)
    checks(`(set 10 1)`, TypeError)
    checks(`(setq 10 1)`, TypeError)
    checks(`(loop 10 1)`, TypeError)
    checks(`(Number 1 2 3 "4")`, TypeError)
    checks(`(String "A" "B" (Array 1 2))`, TypeError)
    checks(`(defconstant x (Number 1 2 3)) (setq x "4")`, TypeError)
    checks(`(String "A" "B" (Array 1 2))`, TypeError)
    checks(`(defconstant x 10) (setf x 23)`, TypeError)
    checks(`(defun fn x (* x 10)) (fn 10 20)`, RangeError)
    checks(`(get (Array 1 2 3 4))`, RangeError)
    checks(`(get (Array 1 2 3 4) 5)`, RangeError)
    checks(`(set (Array 1 2 3 4) 5)`, RangeError)
    checks(`(set (Array 1 2 3 4) 4)`, RangeError)
    checks(`(car ())`, RangeError)
    checks(`(cdr ())`, RangeError)
    checks(`(car (cdr (Array 1)))`, RangeError)
  })
})
