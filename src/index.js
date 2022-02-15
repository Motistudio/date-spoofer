const createSpoofer = require('./createSpoofer')

const DateSpoofer = class {
  constructor () {
    throw new Error('DateSpoofer is static')
  }
}

DateSpoofer.create = createSpoofer
DateSpoofer.restore = createSpoofer.restore

module.exports = DateSpoofer
