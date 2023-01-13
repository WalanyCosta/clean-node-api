module.exports = {
  roots: ['<rootDir>/src'],
  coverageDirectory: 'coverage',
  collectCoverageFrom:['<rootDir>/src/**/*.ts'],
  testEnvironment: 'jest-environment-node',
  preset: '@shelf/jest-mongodb',
  transform: {
      '.+\\.ts$': 'ts-jest',
  }
};

