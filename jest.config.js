module.exports = {
  roots: ['<rootDir>/src'],
  coverageDirectory: 'coverage',
  collectCoverageFrom:[
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**/*',
    '!<rootDir>/src/presentation/protocols/index.ts',
    '!<rootDir>/src/presentation/controllers/signup/signup-protocols.ts',
  ],
  testEnvironment: 'jest-environment-node',
  transform: {
      '.+\\.ts$': 'ts-jest',
  }
};

