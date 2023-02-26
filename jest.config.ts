import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  cacheDirectory: "../../node_modules/.cache/rhf/jest",
  testEnvironment: "jsdom",
  preset: "ts-jest",
  testRegex: [".spec.ts"],
  roots: ["<rootDir>/node_modules", "<rootDir>/src", "<rootDir>/__tests__"],
  coverageProvider: "v8",
  coverageReporters: [
    ["lcov", { projectRoot: "../.." }],
    "clover",
    "json",
    "text",
  ],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "<rootDir>/src/**/*.tsx"],
  coveragePathIgnorePatterns: [
    ".spec",
    "test",
    "tests",
    "types",
    "constants",
    "index.ts",
    ".d.ts",
  ],
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
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules",
  },
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  setupFilesAfterEnv: ["jest-extended/all"],
};
export default config;
