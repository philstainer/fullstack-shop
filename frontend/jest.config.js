module.exports = {
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
  coveragePathIgnorePatterns: [
    '/coverage/',
    '/*.config.js',
    'Meta.js',
    'Page.js',
    '_app.js',
    '_document.js',
    'apolloClient.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    '.*': 'babel-jest',
    '^.+\\.js?$': 'babel-jest',
  },
}
