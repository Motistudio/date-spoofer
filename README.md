# DateSpoofer

DateSpoofer is a library for mocking the Date object and the current time.
What it does is it lets you add an abstraction for the date which received either from `new Date(...)` or from `Date.now()`.

Then, you can get a tweeked version of the original Date.
Finally, you can call `.apply()` to set it as the new global Date.
(And `.restore()` to reset it)

## Installation

Start with
```bash
npm i date-spoofer
```

and
```javascript
const DateSpoofer = require('date-spoofer')
// or
import {create, restore} from 'date-spoofer')
```

## Usage

The usage is pretty simple, just call `create()` to create a new date class, and then apply it so it'll be global:
```javascript
const DateSpoofer = require('date-spoofer')

DateSpoofer.create().apply()
// Date !== the original Date

DateSpoofer.restore()
// Date === the original Date
```

The magic happens in `create()`, it receives a callback that manipulates the time and will be used for every created Date:
```javascript
// Time will always be Jan 1st, 1970
DateSpoofer.create((time) => {
  return 0
}).apply()

// Time will always be one second ago
DateSpoofer.create((time) => {
  return time - 1000
}).apply()

// Time will always be one second into the future!
DateSpoofer.create((time) => {
  return time + 1000
}).apply()

// Time will always have no milliseconds
DateSpoofer.create((time) => {
  return time - (time % 1000)
}).apply()

DateSpoofer.restore() // always nice to clean up
```

It's important to notice that `create()` is returning a new Date class, which you don't actually have to implement

```javascript
const DateSpoofer = require('date-spoofer')

const AlternativeDate = DateSpoofer.create((time) => time - (1000 * 60 * 60 * 24 * 7)) // always last week

console.log(AlternativeDate === Date) // false
console.log(AlternativeDate.now() === Date.now()) // false
console.log((new AlternativeDate().getTime()) === (new Date().getTime())) // false
```

With this instance, we can apply it as default when we want
```javascript
AlternativeDate.apply()

console.log(AlternativeDate === Date) // true
console.log(AlternativeDate.now() === Date.now()) // true
console.log((new AlternativeDate().getTime()) === (new Date().getTime())) // true

// will work only if it's the active Date
AlternativeDate.restore()

// in any case, a global restore is always an option
DateSpoofer.restore()
```
