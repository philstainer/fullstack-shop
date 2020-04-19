module.exports = {
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}'],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/models/',
    '/graphql/',
    '.config',
    '/coverage/',
    'app',
    'src/index',
  ],
  testEnvironment: 'node',
}
