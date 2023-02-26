import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  cacheDirectory: "../../node_modules/.cache/rhf/jest",
  testEnvironment: "jsdom",
  preset: "ts-jest",
  testRegex: [".spec.ts"],
  roots: ["<rootDir>/__tests__", "<rootDir>/src"],
  coverageProvider: "v8",
  coverageReporters: [["lcov", { projectRoot: "../.." }], "clover", "json", "text"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "<rootDir>/src/**/*.tsx"],
  coveragePathIgnorePatterns: [".spec", "test", "tests", "types", "constants", "index.ts"],
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.json",
        isolatedModules: true,
      },
    ],
  },
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
  setupFilesAfterEnv: ["jest-extended/all"],
  moduleNameMapper: {
    "@browser-adapter": ["<rootDir>/src/adapter/adapter.browser.ts"],
    "@server-adapter": ["<rootDir>/src/adapter/adapter.server.ts"],
  },
};
export default config;
