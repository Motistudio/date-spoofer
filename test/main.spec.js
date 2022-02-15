const createSpoofer = require('../src/createSpoofer')
const DateSpoofer = require('../src')

describe('Main instance', () => {
  test('Should have a static main instance', () => {
    expect(typeof DateSpoofer).toBe('function')
    expect(() => new DateSpoofer()).toThrow(Error)
  })

  test('Should have a static create method', () => {
    expect(DateSpoofer.create).toBe(createSpoofer)
  })

  test('Can spoof and restore from the main instance', () => {
    const OriginDate = global.Date
    const Date2 = DateSpoofer.create()
    Date2.apply()
    expect(global.Date).toBe(Date2)
    DateSpoofer.restore()
    expect(global.Date).not.toBe(Date2)
    expect(global.Date).toBe(OriginDate)
  })
})
