module.exports = {
  roots: ['<rootDir>/src'],
  coverageDirectory: 'coverage',
  collectCoverageFrom:[
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**/*',
    '!<rootDir>/src/presentation/protocols/index.ts',
    '!<rootDir>/src/presentation/controllers/signup/signup-controller-protocols.ts',
    '!<rootDir>/src/presentation/controllers/login/login-controller-protocols.ts',
    '!<rootDir>/src/data/usecase/authentication/db-authentication-protocols.ts',
  ],
  testEnvironment: 'jest-environment-node',
  transform: {
      '.+\\.ts$': 'ts-jest',
  }
};

