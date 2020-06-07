module.exports = {
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  transformIgnorePatterns: ['node_modules/.*'],
  collectCoverage: true,
  testRegex: '(/__tests__/.*-test|(\\.|/)(test|spec))\\.jsx?$',
  testEnvironment: 'node',
}
