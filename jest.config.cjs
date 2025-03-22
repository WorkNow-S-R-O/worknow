module.exports = {
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx'],
    setupFiles: ['<rootDir>/jest.setup.js'],
  };