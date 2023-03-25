module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['components/*.{js,jsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: ['/node_modules/(?!(jsonpath-plus)/)'],
}