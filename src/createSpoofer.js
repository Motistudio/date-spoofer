const globalThis = require('the-global-object')

const OriginDate = Date

const noop = (arg) => arg

const createSpoofer = (modify) => {
  const modifyTime = modify || noop

  /**
   * An alternate constructor
   * @param {...any} args - Date constructor args
   */
  const constructor = function (...args) {
    // originConstructor.call(this, ...args)
    const currentTime = this.getTime()
    const alternateTime = modifyTime(currentTime)
    if (currentTime !== alternateTime) {
      this.setTime(alternateTime)
    }
  }

  /**
   * An alternate now() function
   * @returns The current time in milliseconds
   */
  const now = function () {
    return modifyTime(OriginDate.now())
  }

  const AlternateDate = class extends OriginDate {
    constructor (...args) {
      super(...args)
      constructor.call(this, ...args)
    }
  }

  // assinging functions
  Object.getOwnPropertyNames(OriginDate).forEach((name) => {
    AlternateDate[name] = OriginDate[name]
  })
  AlternateDate.now = now

  // extra methods:
  AlternateDate.apply = (globalObject = globalThis) => {
    globalObject.Date = AlternateDate
    return () => AlternateDate.restore(globalObject)
  }

  AlternateDate.restore = (globalObject = globalThis) => {
    if (globalObject.Date === AlternateDate) {
      globalObject.Date = OriginDate
    }
  }

  return AlternateDate
}

createSpoofer.restore = () => {
  if (globalThis.Date !== OriginDate) {
    globalThis.Date = OriginDate
  }
}

module.exports = createSpoofer
