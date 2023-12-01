module.exports = {
  roots: ['<rootDir>/lib/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', 'jest-expect-message'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testMatch: ['**/*.(spec|test).ts'],
  clearMocks: true,
  bail: false,
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { isolatedModules: true, tsconfig: 'tsconfig.json' }],
  },
  moduleNameMapper: {
    '@utils/(.*)': '<rootDir>/lib/utils/$1',
    '@utils': '<rootDir>/lib/utils/',
    '@types/(.*)': '<rootDir>/lib/types/$1',
    '@types': '<rootDir>/lib/types/',
    '@locales/(.*)': '<rootDir>/lib/locales/$1',
    '@locales': '<rootDir>/lib/locales/',
    '@lib': '<rootDir>/lib/',
  },
};
