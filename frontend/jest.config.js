module.exports = {
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
      '^api/(.*)$': '<rootDir>/src/api/$1',
      '^features/(.*)$': '<rootDir>/src/features/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
    testEnvironment: 'jsdom',
  };
  