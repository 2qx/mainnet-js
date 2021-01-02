module.exports = {
  verbose: true,
  rootDir: "./",
  preset: "jest-playwright-preset",
  collectCoverageFrom: ["**/*.{js}", "!**/node_modules/**", "!**/generated/**"],
  coveragePathIgnorePatterns: [
    ".*/src/.*\\.d\\.ts",
    ".*/src/.*\\.test\\.{ts,js}",
  ],
  roots: ["<rootDir>"], 
  testMatch: [
    "**/**.test.headless.js",
    "contract/**.test.headless.js",
    "db/**.test.headless.js",
    "wallet/**.test.headless.js",
    "network/**.test.headless.js"
],
  testPathIgnorePatterns: ["/node_modules/"], //
  testEnvironment: "node",
  testEnvironmentOptions: {
    "jest-playwright": {
      browsers: ["chromium", "firefox", "webkit"],
    },
  },
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  globalSetup: "<rootDir>/jest/browser.setup.js",
  globalTeardown: "<rootDir>/jest/browser.teardown.js",
  testTimeout: 60000,
};