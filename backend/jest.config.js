module.exports = {
  collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}'],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/models/',
    '/typeDefs/',
    '/resolvers/index',
    'schema',
    'apolloServer',
    'createTestClient',
    '.config',
    '/coverage/',
    'app',
    'src/index',
  ],
  testEnvironment: 'node',
}
