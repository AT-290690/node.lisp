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
    checks(`(set 10 1)`, TypeError)
    checks(`(loop 10 1)`, TypeError)
    checks(`(defconstant x (Array 1 2 3)) (set x "4")`, TypeError)
    checks(`(defconstant x 10) (setf x 23)`, TypeError)
    checks(`(defun fn x (* x 10)) (fn 10 20)`, RangeError)
    checks(`(get (Array 1 2 3 4))`, RangeError)
    checks(`(get (Array 1 2 3 4) 5)`, RangeError)
    checks(`(set (Array 1 2 3 4) 5)`, RangeError)
    checks(`(set (Array 1 2 3 4) 4)`, RangeError)
    checks(`(car ())`, RangeError)
    checks(`(cdr ())`, RangeError)
    checks(`(car (cdr (Array 1)))`, RangeError)
    checks(`(defvar _ 10)`, ReferenceError)
    checks(`(defconstant _ 10)`, ReferenceError)
    checks(`(defun _ (+ x 10))`, ReferenceError)
    checks(`(defun x _ (+ _ 10))`, ReferenceError)
    checks(`(defconstant type 10)`, ReferenceError)
    checks(
      `(defun std (do (defun push! a x (set a (length a) x)) (Array (Array "push!" push!)))) (import std "java.Array")`,
      ReferenceError
    )
  })
})
