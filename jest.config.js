module.exports = {
  roots: ['<rootDir>/src'],
  coverageDirectory: 'coverage',
  collectCoverageFrom:['<rootDir>/src/**/*.ts'],
  testEnvironment: 'jest-environment-node',
  transform: {
      '.+\\.ts$': 'ts-jest',
  }
};

