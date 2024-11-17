export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    // Redirect imports from dist to src
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
};
