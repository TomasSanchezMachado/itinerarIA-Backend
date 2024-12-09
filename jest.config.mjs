//NO HACE FALTA SI USAMOS VITEST

const jestConfig = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
        useESM: true, // Move ts-jest-specific settings here
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  resolver: "ts-jest-resolver",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"], // Ensure compatibility with Node
  },
};

export default jestConfig;
