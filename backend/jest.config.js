const path = require('path')

module.exports = {
  collectCoverage: true,
  testRegex: '(/__tests__/.*-test|(\\.|/)(test|spec))\\.jsx?$',
  testEnvironment: 'node',
}
