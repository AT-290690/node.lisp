# wisp

Lisp for web

```lisp
(:= hello "Hello World")
(log (++ hello "!!!"))
```

interpred

```
yarn wisp -file <filepath> -run
```

or compile

```
yarn wisp -file <filepath> -js
```

write to file

```
yarn wisp -s <filepath lisp> -d <filepath js> -compile
```

show help

```
yarn wisp -help
```

```
  ------------------------------------
  | help                              |
  ------------------------------------
  | file    |   prepare a file        |
   ------------------------------------
  | js      |   log javascript output |
  ------------------------------------
  | compile |   compile to js         |
  ------------------------------------
  | dist    |   file to compile js    |
  ------------------------------------
  | run     |   interpret and run     |
  ------------------------------------
  | log     |   interpret and log     |
  ------------------------------------
```
