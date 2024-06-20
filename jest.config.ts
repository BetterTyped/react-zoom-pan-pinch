import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  cacheDirectory: "../../node_modules/.cache/rhf/jest",
  testEnvironment: "jsdom",
  preset: "ts-jest",
  testRegex: [".spec.ts"],
  roots: ["<rootDir>/node_modules", "<rootDir>/src", "<rootDir>/__tests__"],
  coverageProvider: "v8",
  coverageReporters: [
    ["lcov", { projectRoot: "./" }],
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
    "^.+\\.(css|scss|sass|less)$": "jest-preview/transforms/css",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
      "jest-preview/transforms/file",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules",
  },
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  setupFilesAfterEnv: ["jest-extended/all", "./jest.setup.ts"],
};
export default config;
