const createSpoofer = require('../src/createSpoofer')

const createRounder = (round) => {
  return (timestamp) => {
    return timestamp - (timestamp % round)
  }
}

const toSec = createRounder(1000)

const createMargin = (time) => (timestamp) => timestamp + time

describe('Spoofer', () => {
  test('Should make a transparent wrapper', () => {
    const AlternateDate = createSpoofer()
    expect(AlternateDate.prototype).toBeInstanceOf(Date)
    const date = new Date()
    const newDate = new AlternateDate()
    expect(newDate).toBeInstanceOf(Date)
    // calculate now, ignoring milliseconds
    expect(toSec(date.getTime())).toBe(toSec(newDate.getTime()))
    expect(toSec(Date.now())).toBe(toSec(AlternateDate.now()))
    // has all of the static methods
    expect(Object.getOwnPropertyNames(Date).every((name) => AlternateDate.hasOwnProperty(name))).toBe(true)
  })

  test.each([
    ['present (transparent)', createMargin(0)],
    ['future week', createMargin(1000 * 60 * 60 * 24 * 7)],
    ['past month', createMargin(-(1000 * 60 * 60 * 24 * 7 * 30))]
  ])('Should make an offset of %s', (desc, modify) => {
    const AlternateDate = createSpoofer(modify)
    const date = new Date()
    const newDate = new AlternateDate()
    expect(toSec(newDate.getTime())).toBe(toSec(modify(date.getTime())))
    expect(toSec(AlternateDate.now())).toBe(toSec(modify(Date.now())))
  })

  test('Should apply to global object', () => {
    const AlternateDate = createSpoofer()
    const OriginDate = global.Date
    expect(AlternateDate).toBeTruthy()
    expect(OriginDate).toBeTruthy()

    // Override by providing global
    expect(global.Date).toBe(OriginDate)
    AlternateDate.apply(global)
    expect(global.Date).toBe(AlternateDate)
    AlternateDate.restore(global)
    expect(global.Date).toBe(OriginDate)

    // Overriding without parameters
    AlternateDate.apply()
    expect(global.Date).toBe(AlternateDate)
    AlternateDate.restore()
    expect(global.Date).toBe(OriginDate)

    // Overriding using the callback
    const restore = AlternateDate.apply(global)
    expect(global.Date).toBe(AlternateDate)
    restore()
    expect(global.Date).toBe(OriginDate)

    // can restore without applying
    AlternateDate.restore()
    expect(global.Date).toBe(OriginDate)
  })

  test('Should apply and restore globally', () => {
    const AlternateDate = createSpoofer()
    const OriginDate = global.Date
    AlternateDate.apply()
    expect(global.Date).toBe(AlternateDate)
    createSpoofer.restore()
    expect(global.Date).toBe(OriginDate)

    // can restore again with no issues
    createSpoofer.restore()
    expect(global.Date).toBe(OriginDate)
  })
})
